import { NextRequest } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!key) return new Response('Missing key', { status: 400 });

  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: MINIO_BUCKET, Key: key })
    );
    // @ts-ignore
    const stream = obj.Body as ReadableStream;
    const contentType = obj.ContentType || 'application/octet-stream';
    return new Response(stream, { headers: { 'Content-Type': contentType } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}