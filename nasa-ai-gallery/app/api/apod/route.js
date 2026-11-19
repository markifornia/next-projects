import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";
import { normalizeApod } from "../../../lib/apod";

// Give retries room to finish on Vercel
export const maxDuration = 30;

// NASA's new APOD endpoint (no API key needed). The legacy
// api.nasa.gov/planetary/apod endpoint now returns a placeholder for every
// date and is scheduled to be archived 2026-12-01.
const APOD_BASE = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

// APOD archive starts 1995-06-16
const APOD_START = new Date("1995-06-16").getTime();
const FETCH_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 5;

// Random date as { iso: "2012-08-07", path: "120807" }
function randomDate() {
  const t = APOD_START + Math.random() * (Date.now() - APOD_START);
  const iso = new Date(t).toISOString().slice(0, 10);
  return { iso, path: iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10) };
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`apod:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  let lastError = "No valid APOD entry found";
  let lastStatus = 502;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const { iso, path } = randomDate();
    try {
      const res = await fetchWithTimeout(`${APOD_BASE}/${path}`, FETCH_TIMEOUT_MS);

      if (res.status === 429) {
        return NextResponse.json(
          { error: "NASA rate limit reached. Try again in a bit." },
          { status: 429 }
        );
      }

      if (!res.ok) {
        // Some early dates have no entry — just try another date
        lastError = `NASA request failed (status ${res.status})`;
        continue;
      }

      const raw = await res.json();
      const entry = normalizeApod(raw);
      if (entry) {
        return NextResponse.json({ ...entry, date: entry.date || iso });
      }

      // Logged so rejected entries show up in Vercel's runtime logs
      console.warn("APOD entry rejected", {
        date: iso,
        title: raw?.title,
        media_type: raw?.media_type,
        hasHdurl: Boolean(raw?.hdurl)
      });
      lastError = "NASA returned an unusable entry";
    } catch (err) {
      const timedOut = err.name === "AbortError";
      lastError = timedOut
        ? "NASA API timed out"
        : `Failed to reach NASA API: ${err.message}`;
      lastStatus = timedOut ? 504 : 500;
    }
  }

  return NextResponse.json({ error: lastError }, { status: lastStatus });
}
