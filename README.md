# MockMind

MockMind is an interview-practice web application that provides AI-powered mock interviews, session tracking, question management, and resume parsing.

## Features

- AI-driven mock interviews and answer evaluation (backend `utils/gemini.js`).
- User authentication and session management.
- Resume upload & parsing (PDF parsing + multer).
- Question bank and leaderboard tracking.
- React + Vite frontend with Tailwind for styling.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS
- AI / NLP: Google Generative AI (via `@google/generative-ai`) and custom utilities

## Repository Structure

- Backend/server — Express API and Mongoose models
  - `controllers/` — route handlers
  - `models/` — Mongoose models
  - `routes/` — Express routes
  - `utils/` — helper utilities (AI, PDF parsing, multer config)
- Frontend/client — React app (Vite)

## Prerequisites

- Node.js (v18+ recommended)
- npm (or yarn)
- MongoDB running locally or a MongoDB URI

## Environment Variables

Create a `.env` file in `Backend/server` with the following variables (example values are in the project):

```
MONGO_URI=mongodb://localhost:27017/mockmind
JWT_SECRET=your_jwt_secret
PORT=5000
OPENROUTER_API_KEY=your_openrouter_or_ai_key
```

Do NOT commit real secrets to the repository. Use a secrets manager or GitHub Actions secrets for CI environments.

## Quick Start

1. Backend

```bash
cd Backend/server
npm install
# development with auto-reload
npm run dev
# or start production server
npm start
```

The backend listens on `PORT` from `.env` (default `5000`).

2. Frontend

```bash
cd Frontend/client
npm install
npm run dev
```

Open the Vite dev server URL shown in the console (usually `http://localhost:5173`).

## Scripts (from package.json)

- Backend: `npm run dev` (nodemon server.js), `npm start` (node server.js)
- Frontend: `npm run dev` (vite), `npm run build` (vite build), `npm run preview` (vite preview)

## API Overview

- `GET /` — health check
- `POST /api/auth/*` — authentication
- `GET/POST /api/questions` — question endpoints
- `/api/interview` & `/api/sessions` — interview/session flow
- `POST /api/ai` — AI interaction endpoints
- `POST /api/resume` — resume upload & parsing

(See the `Backend/server/routes` folder for full route list.)

## Development Notes

- The server expects `MONGO_URI` and `JWT_SECRET` to be set.
- The project uses `multer` + `pdf-parse` to extract resume content.
- AI integration is implemented under `Backend/server/utils/gemini.js` — update keys in `.env` as needed.

## Contributing

- Fork the repo and open a PR with a clear description.
- Keep changes small and focused; include tests when applicable.

## License

This project does not include a license file. Add one (e.g., MIT) if you intend to open-source it.

## Contact

If you need help, open an issue or contact the maintainer.
