import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../../../lib/prisma';

const LOCAL_PYTHON_API_URL = 'http://127.0.0.1:8000/caption';
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT!;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY!;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY!;
const MINIO_BUCKET = process.env.MINIO_BUCKET!;

const s3 = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    // Decode base64 image
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    const buffer = Buffer.from(matches[2], 'base64');

    // Send to local Python FastAPI server
    const formData = new FormData();
    formData.append('file', new Blob([buffer]), 'image.jpg');

    const pyRes = await fetch(LOCAL_PYTHON_API_URL, {
      method: 'POST',
      body: formData as unknown as BodyInit,
    });

    if (!pyRes.ok) {
      const errorText = await pyRes.text();
      console.error('Python API error:', errorText);
      return NextResponse.json({ error: 'Python API error' }, { status: 500 });
    }

    const pyData = await pyRes.json();
    const label = pyData.label || 'No label found';

    // Store image in MinIO
    const filename = `${Date.now()}.jpg`;
    await s3.send(new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: filename,
      Body: buffer,
      Metadata: { caption: label },
      ContentType: matches[1],
    }));

    // Store metadata in DB
    await prisma.image.create({
      data: {
        key: filename,
        caption: label,
      },
    });

    return NextResponse.json({ label });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const captionQuery = searchParams.get('caption')?.toLowerCase() || '';

    // Search in DB
    const images = await prisma.image.findMany({
      where: {
        caption: {
          contains: captionQuery
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const results = images.map(img => ({
      url: `/api/image?key=${encodeURIComponent(img.key)}`,
      caption: img.caption,
    }));

    return NextResponse.json({ results });
  } catch  {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}