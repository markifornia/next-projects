# NASA AI Gallery

A small full-stack Next.js app that pulls a random image from NASA's
Astronomy Picture of the Day (APOD) API and generates a fresh,
real-time description of it using an LLM on Groq's inference API,
streamed to the page as it's written.

**Stack:** Next.js 16 (App Router, Turbopack) · React · Groq API (OpenAI-compatible) · Vercel

## How it works

- `GET /api/apod` — server-side route that picks a random date since
  APOD's archive began (1995-06-16) and fetches that day's entry from
  NASA's public API. Falls back to a retry date if a given day has no
  entry.
- `POST /api/describe` — server-side route that sends the image's
  title/caption to Groq (`openai/gpt-oss-120b`) via the OpenAI SDK's
  compatible client, and **streams** the response back to the client
  token-by-token.
- `app/page.js` — client component with a "Shuffle" button that calls
  both routes in sequence and renders the image + streaming text.

Both API keys stay server-side (in environment variables) and are
never exposed to the browser.

## Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your GROQ_API_KEY
npm run dev
```

Open http://localhost:3000

### Getting API keys

- **NASA_API_KEY** — free, instant, at https://api.nasa.gov. Not
  required for testing — the app falls back to NASA's shared
  `DEMO_KEY`, which is rate-limited (30 requests/hour), so get your
  own key before demoing this live.
- **GROQ_API_KEY** — free, no credit card required, at
  https://console.groq.com/keys. Sign in with email, Google, or
  GitHub, then click "Create API Key". Required for the AI
  description feature. Groq is OpenAI-SDK-compatible, which is why
  the code uses the `openai` npm package pointed at Groq's base URL.

## Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. In the project's **Settings → Environment Variables**, add:
   - `NASA_API_KEY` (optional, defaults to `DEMO_KEY`)
   - `GROQ_API_KEY` (required)
4. Deploy. Vercel auto-detects Next.js — no build config needed.
5. **Important:** if you ever change an environment variable value
   after the first deploy, Vercel does not automatically rebuild —
   go to Deployments → (latest) → **⋯ → Redeploy** to pick it up.

Because everything lives inside the standard `app/` directory with no
custom routing or rewrites, this deploys cleanly with zero config and
won't 404 on refresh or on the API routes.

## Security notes

- `.env.local` is git-ignored and never committed — real keys only
  live there locally and in Vercel's own environment variable store.
- Dependencies are kept current to avoid known CVEs (this project
  runs Next.js 16.3.1, patched against several high-severity
  advisories present in the 14.x line as of mid-2026 — run
  `npm audit` periodically to check for new ones).

## Possible extensions for the portfolio writeup

- Cache each day's NASA response (e.g. with `fetch`'s `next: { revalidate }`) to cut down on repeat calls to `DEMO_KEY`
- Add a "favorites" list using localStorage
- Swap APOD for NASA's Image and Video Library search API for more variety
- Add a loading skeleton animation instead of plain text
