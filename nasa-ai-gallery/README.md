# NASA AI Gallery

A small full-stack Next.js app that pulls a random image from NASA's
Astronomy Picture of the Day (APOD) API and generates a fresh,
real-time description of it using an LLM on Groq's inference API,
streamed to the page as it's written.

**Stack:** Next.js 16 (App Router, Turbopack) · React · Groq API (OpenAI-compatible) · Vercel

## How it works

- `GET /api/apod` — server-side route that picks a random date since
  APOD's archive began (1995-06-16) and fetches that day's entry from
  NASA's new `science.nasa.gov/wp-json/wp/v2/apod-basic/YYMMDD`
  endpoint (the legacy `api.nasa.gov/planetary/apod` endpoint now
  returns a placeholder for every date and is being archived
  2026-12-01). `lib/apod.js` cleans the HTML fields and picks the
  right image URL; entries that are missing media or are the
  "NASA Science" placeholder are skipped and another date is tried.
- `POST /api/describe` — server-side route that sends the image's
  title/caption to Groq (`openai/gpt-oss-120b`) via the OpenAI SDK's
  compatible client, and **streams** the response back to the client
  token-by-token.
- `app/page.js` — client component with a "Shuffle" button that calls
  both routes in sequence and renders the image + streaming text.

The Groq key stays server-side (in an environment variable) and is
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

- **NASA** — no key needed. The app reads APOD from NASA's new
  `science.nasa.gov` endpoint, which is public.
- **GROQ_API_KEY** — free, no credit card required, at
  https://console.groq.com/keys. Sign in with email, Google, or
  GitHub, then click "Create API Key". Required for the AI
  description feature. Groq is OpenAI-SDK-compatible, which is why
  the code uses the `openai` npm package pointed at Groq's base URL.

## Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. In the project's **Settings → Environment Variables**, add:
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

- Cache each day's NASA response (e.g. with `fetch`'s `next: { revalidate }`) to cut down on repeat calls
- Add a "favorites" list using localStorage
- Swap APOD for NASA's Image and Video Library search API for more variety
- Add a loading skeleton animation instead of plain text
