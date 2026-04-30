# MediCore

MediCore is a frontend-focused healthcare SaaS dashboard built as part of a frontend engineering assignment. The goal wasn’t just to build screens, but to model how a real clinical operations tool would behave — from authentication and data flow to UX decisions and system boundaries.

Live demo: https://medicore-bice.vercel.app/login

You can log in using test credentials or Google sign-in.

Test Creds:-
Email - test@medicore.com
Passowrd - Test@1234

---

## Project overview

The app simulates a care team dashboard where users can:

- sign in securely
- review operational metrics
- explore patient data
- switch between dense and readable views
- generate AI-assisted summaries from patient context

The focus was to keep it frontend-heavy, but structured in a way that it could evolve into a production system without major rewrites.

---

## What’s implemented

### Authentication

- Firebase Authentication (email/password + Google)
- Google sign-in handles both login and first-time user registration automatically
- Clean handling of loading and error states
- No raw Firebase errors exposed to the UI

---

### Dashboard

- Operational KPIs with count-up animation
- Recent activity feed
- Quick actions
- Skeleton loading aligned with final layout
- Backed by a simulated API layer (not direct mock usage)

---

### Analytics

- Line, bar, and pie charts using Recharts
- Derived + curated datasets for stability and realism
- Date range controls
- Structured layout that scales without clutter

---

### Patient module

- Grid and list view toggle
- Debounced search
- Pagination and rows-per-page control
- Empty states (no dead screens)
- Side panel for patient details
- Add patient flow with feedback

---

### AI patient summary

- Groq-powered summaries inside patient panel
- Streaming responses in development
- Serverless fallback in production (Vercel)
- Abort support during generation
- One-time generation guard to prevent repeated requests
- Clean formatting (no raw markdown artifacts)

---

### Notifications

- Toast notifications for user actions (success / error / cancellation)
- In-app notification store
- Service worker for browser-level notifications (e.g. AI summary completion)

---

## Key decisions / architecture

### Simulated API layer

Instead of binding UI directly to mock data, I introduced small service functions for dashboard, analytics, and patient data.

This keeps components closer to real-world structure and makes loading, caching, and error handling easier to reason about.

---

### Lightweight caching & request deduplication

The data layer includes:

- in-memory caching
- shared pending request handling

This avoids redundant calls and mimics behavior of tools like React Query, without adding extra dependencies.

---

### Zustand for state management

Zustand is used for:

- auth state
- patient data
- notifications
- UI state (sidebar, theme)

It keeps the store simple, avoids boilerplate, and scales well for this app size.

---

### Avoiding unnecessary complexity

The goal was to keep the system honest:

- components are reusable but not over-abstracted
- pages focus on composition
- services handle data access
- stores handle shared state

No layers were added unless they solved a real problem.

---

## AI summary: streaming implementation

The AI summary flow is implemented with streaming rather than a simple request/response.

1. The client sends patient data to `/api/ai-summary`
2. In development, requests are proxied to a local Express server
3. In production, the same endpoint is handled via a Vercel serverless function
4. The Groq API returns a streamed response
5. The frontend reads the stream using `ReadableStream` and appends tokens progressively
6. `AbortController` is used to allow users to stop generation mid-way

This makes the interaction feel closer to a real product rather than a static response.

---

## What I focused on

Most effort went into areas that usually separate polished apps from basic ones:

- loading states that match layout (no layout jumps)
- meaningful empty states
- clear feedback after actions
- responsive layouts that still feel intentional
- friendly error handling (no backend noise in UI)

On the performance side:

- request deduplication
- lightweight caching
- debounced search
- avoiding unnecessary refetches

---

## Extras beyond assignment

A few additions go beyond the base requirements:

- AI streaming with abort support
- prevention of repeated AI generation
- formatting AI output for readability
- toast + service worker notification integration
- lightweight caching layer for dashboard data
- improved UX around edge states and errors

---

## Running the project

Install dependencies:

```bash
npm install
```

Add environment variables in `.env`:

- Firebase config (client-side)
- `GROQ_API_KEY`

Run locally:

```bash
npm run dev:full
```

This runs both the Vite app and the local AI server.

---

## Deployment notes

The app is deployed on Vercel.

Since Vercel doesn’t run traditional Node servers:

- the AI endpoint is implemented as a serverless function in production
- a local Express server is used only for development

This keeps local development flexible while staying compatible with Vercel’s execution model.

---

## Closing note

If this were extended beyond assignment scope, the next step wouldn’t be adding more screens — it would be tightening the system:

- stronger data layer consistency
- test coverage around stores and flows
- better form handling and validation
- role-based access control
- backend persistence and audit tracking

For this assignment, the focus was to keep it frontend-first, realistic, and maintainable without overengineering beyond what the scope actually required.

---

**Bhavsagar**
Frontend Engineer
