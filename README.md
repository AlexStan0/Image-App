# Image-App

## Overview

**Image-App** is a full-stack web application that allows users to upload images, automatically generate captions using a machine learning model, store images and metadata, and search for images by caption. The project is built with:

- **Frontend & API**: Next.js (React, TypeScript)
- **Backend (Captioning)**: Python FastAPI server using Hugging Face Transformers
- **Storage**: MinIO (S3-compatible object storage)
- **Database**: Prisma ORM with SQLite (default, can be swapped for PostgreSQL/MySQL)
- **CI/CD**: GitHub Actions

---

## Features

- **Image Upload**: Users can upload images via the web interface.
- **Automatic Captioning**: Uploaded images are sent to a FastAPI server, which uses a BLIP model to generate captions.
- **Persistent Storage**: Images are stored in MinIO; captions and metadata are stored in a relational database.
- **Search**: Users can search for images by caption, even after restarts.
- **Modern UI**: Google-style search bar and clean, dark-themed interface.
- **CI/CD**: Automated build, test, and (optionally) deploy via GitHub Actions.

---

## Architecture

```
[User] <---> [Next.js Frontend/API] <---> [MinIO Storage]
                                  |         [Prisma ORM + SQLite]
                                  |
                                  +---> [Python FastAPI Caption Server]
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker (for MinIO, optional but recommended)
- (Optional) Docker Compose

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/image-app.git
cd image-app
```

### 2. Start MinIO (S3 Storage)

```sh
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=<custom_login> \
  -e MINIO_ROOT_PASSWORD=<custom_pass> \
  minio/minio server /data --console-address ":9001"
```
- Access MinIO Console at [http://localhost:9001](http://localhost:9001).

### 3. Start the Python Caption Server

```sh
cd python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn caption_server:app --host 127.0.0.1 --port 8000
```

### 4. Set Up the Database

```sh
npx prisma migrate dev
```

### 5. Start the Next.js App

```sh
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Configuration

- **Environment variables** are used for MinIO and database credentials. See `.env.example` for reference.
- **Prisma** uses SQLite by default. To use PostgreSQL or MySQL, update `prisma/schema.prisma` and your `.env`.

---

## Project Structure

```
.
├── python/                 # FastAPI caption server
│   ├── caption_server.py
│   └── requirements.txt
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── label/      # Upload/search API
│   │       └── image/      # Serve image API
│   └── components/
│       └── Search.tsx      # Main search page
├── lib/
│   └── prisma.ts           # Prisma client
├── .github/workflows/      # GitHub Actions workflows
│   └── deploy.yml
├── Dockerfile              # Next.js Dockerfile
├── docker-compose.yml      # (optional) Compose for local dev
├── package.json
└── README.md
```

---

## Troubleshooting

- **MinIO not starting?** Make sure ports 9000 and 9001 are free.
- **Python server errors?** Check that all dependencies are installed and the model downloads successfully.
- **Search not working after restart?** Ensure Prisma migrations are up-to-date and the database is not in `.gitignore`.

---

## License

MIT

---

# Contributing

See [CONTRIB.README.md](CONTRIB.README.md) for guidelines.
