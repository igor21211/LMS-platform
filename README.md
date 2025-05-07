# LMS Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-green)](https://lms-platform-sandy.vercel.app/)

A multifunctional e-learning platform built with Next.js, Prisma, and TypeScript for creating, searching, and taking online courses.

---

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure your .env file:**  
   Copy `.env.example` to `.env` and set your database and service credentials.

3. **Apply migrations and generate Prisma Client:**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Seed the database with initial data:**

   ```bash
   npx ts-node scripts/seed.ts
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

- `app/` — Main pages, routes, and layouts
- `components/` — Reusable UI components
- `actions/` — Server actions for courses, analytics, and progress
- `lib/` — Utilities, database, and integrations (Stripe, uploadthing, etc.)
- `prisma/` — Prisma database schema
- `scripts/` — Database seeding scripts
- `public/` — Static files and icons

---

## 🧩 Main Features

- **Categories & Course Search** — Filter by category, search by title
- **Dashboard** — View purchased and created courses, analytics
- **Course Purchase & Progress** — Track progress, chapters, access by purchase
- **Stripe Integration** — Course payments
- **File Uploads** — uploadthing support
- **User Roles** — Teacher/Student

---

## 🛠️ Scripts

- `npm run dev` — Start the dev server
- `npm run build` — Build the app
- `npx ts-node scripts/seed.ts` — Seed the database with initial categories and test data

---

## 🗄️ Database

- Schema is defined in `prisma/schema.prisma`
- To apply migrations:
  ```bash
  npx prisma migrate deploy
  ```
- To generate the client:
  ```bash
  npx prisma generate
  ```

---

## 📝 Technologies

- **Next.js** (App Router)
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (or any supported DB)
- **Stripe API**
- **Tailwind CSS**
- **React Icons**

---

## 📂 Example Files

- `scripts/seed.ts` — Script for seeding categories
- `actions/get-courses.ts` — Fetching courses with user progress
- `components/course-progress.tsx` — Progress display component

---

## 💡 Tips

- For local development, Node.js 18+ is recommended.
- Generated Prisma files are ignored by ESLint (see `eslint.config.mjs`).
- For deployment on Vercel or other platforms, follow the [official Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 📬 Contribution

If you want to suggest improvements or found a bug — open an issue or pull request!
