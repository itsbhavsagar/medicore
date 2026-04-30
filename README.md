# MediCore

MediCore is a production-style B2B healthcare SaaS dashboard built for a frontend engineering assignment. The app focuses on operational visibility for care teams: secure Firebase sign-in, a themed analytics workspace, searchable patient records, and a Groq-powered streaming AI summary inside the patient details panel.

Live demo link: [http://localhost:5173](http://localhost:5173)

## Project overview

- `Dashboard`: operational KPIs, recent activity feed, quick actions, and loading skeletons.
- `Analytics`: themed Recharts line, pie, and bar visualizations with date-range controls.
- `Patients`: debounced search, grid/list toggle, motion transitions, side panel details, and AI summary streaming.
- `Notifications`: service-worker-backed local notifications after login and AI summary completion.

## Architecture decisions

### Why Vite over CRA

- Vite gives much faster cold starts and HMR, which matters when iterating on a dashboard with many components and charts.
- The Vite proxy made it straightforward to forward `/api/ai-summary` requests to a lightweight local Express server during development.
- The project uses modern ESM-friendly tooling out of the box, which pairs well with React 19 and current frontend libraries.

### Why Zustand over Redux

- The app state is small and domain-focused: auth, theme, notifications, and patient browsing state.
- Zustand keeps the store layer minimal without reducers, action constants, or boilerplate that would slow down an assignment build without adding meaningful structure here.
- Stores remain easy to test and reason about because each slice is isolated and typed.

### Frontend structure

- `src/components/ui`: reusable design-system primitives.
- `src/components/layout`: chrome shared across authenticated routes.
- `src/components/patients`: patient-specific building blocks and the AI summary panel.
- `src/store`: Zustand slices for auth, patients, theme, and notifications.
- `src/services`: Firebase, AI streaming, and browser notification boundaries.
- `server/ai-server.mjs`: Express endpoint that streams Groq completions to the frontend.

## AI feature: how streaming works

1. The patient side panel sends the selected patient record to `/api/ai-summary`.
2. Vite proxies that request to the local Express server on port `8787`.
3. The Express handler calls Groq with the `llama-3.1-8b-instant` model in streaming mode.
4. Each streamed delta is written back to the HTTP response as it arrives.
5. The React client reads the `ReadableStream` with `response.body.getReader()` and appends tokens into the UI progressively.
6. Users can stop the stream with `AbortController`, and the button stays locked while generation is active.

## Setup instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create a `.env` file in the project root using `.env.example` as a template.

Required Vite / Firebase variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`

Required backend variable:

- `GROQ_API_KEY`

### 3. Run the app

Frontend only:

```bash
npm run dev
```

Frontend + AI server together:

```bash
npm run dev:full
```

AI server only:

```bash
npm run server
```

## Key implementation notes

- Theme preference is persisted in `localStorage` and seeded from system preference on first load.
- All major colors are controlled through CSS variables so dark and light mode stay consistent.
- Route-level transitions, panel transitions, grid/list transitions, and stat-card load motion are handled with Framer Motion.
- Notifications are delivered through a registered service worker and focus the app window when clicked.

## Known limitations

- Firebase configuration is required before login will succeed; there is no mock-auth fallback because the assignment explicitly asked for Firebase email/password auth.
- The AI server is intended for local development and would need deployment hardening, request auth, and rate limiting for production.
- Recharts tooltip styling still relies on chart-level props because chart internals are less class-driven than the rest of the UI.
