# Contributing to Image-App

Thank you for your interest in contributing to **Image-App**!  
We welcome contributions of all kinds: bug fixes, new features, documentation, and more.

---

## How to Contribute

### 1. **Fork the Repository**

Click "Fork" at the top right of the repo page and clone your fork:

```sh
git clone https://github.com/your-username/image-app.git
cd image-app
```

### 2. **Create a Branch**

```sh
git checkout -b feature/your-feature-name
```

### 3. **Make Your Changes**

- Follow the existing code style.
- Add tests if possible.
- Update documentation as needed.

### 4. **Test Your Changes**

- Run `npm run dev` for the frontend.
- Run the Python server as described in the main README.
- Run `npm test` or your preferred test runner.

### 5. **Commit and Push**

```sh
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
```

### 6. **Open a Pull Request**

Go to your fork on GitHub and click "Compare & pull request".

---

## Code of Conduct

Please be respectful and constructive in all interactions.

---

## Guidelines

- **Bug Reports:** Open an issue with clear steps to reproduce.
- **Feature Requests:** Open an issue describing your idea and why it’s useful.
- **Pull Requests:** Reference related issues and describe your changes.

---

## Development Notes

- **Frontend:** Next.js (TypeScript, React)
- **Backend:** FastAPI (Python)
- **Storage:** MinIO (S3-compatible)
- **Database:** Prisma ORM (SQLite by default)
- **CI/CD:** GitHub Actions

---

## Questions?

Open an issue or start a discussion!

---

Thank you for helping make Image