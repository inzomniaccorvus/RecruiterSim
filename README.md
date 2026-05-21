# Recruiter Simulator

An AI-powered web app that reviews your resume and delivers honest, constructive feedback — with a side of humor. Upload your resume, enter the role you're targeting and your salary expectation, and get a roast-style critique from a simulated recruiter.

**Live demo:** [recruiter-simulator.vercel.app](https://recruiter-simulator.vercel.app)

---

## Features

- **AI resume analysis** — Powered by Gemini 2.5 Flash. Generates a summary and detailed feedback tailored to the role and salary you specify.
- **Anonymous submissions** — No account required to get a roast. Just upload and go.
- **Submission history** — Register and log in to save your results and revisit them anytime.
- **JWT authentication** — Secure login and registration with bcrypt password hashing and JWT-based session management.
- **Print / Save as PDF** — Export your feedback directly from the results page.

---

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4
- React Router v7

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- Gemini 2.5 Flash API

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Local Setup

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Gemini API key](https://aistudio.google.com)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
DATABASE_URL=your_neon_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run migrations and start the server:

```bash
npx prisma migrate dev
node index.js
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

---

## Notes

- Anonymous submissions are not saved. Create an account to retain your history.
- The AI occasionally experiences high demand — if a submission fails, try again after a moment.
- PDF resumes only. Max file size: 5MB.
