import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";

// APOD archive starts 1995-06-16
const APOD_START = new Date("1995-06-16").getTime();
const FETCH_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 4;

function randomDate() {
  const now = Date.now();
  const t = APOD_START + Math.random() * (now - APOD_START);
  return new Date(t).toISOString().slice(0, 10); // YYYY-MM-DD
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Known placeholder records NASA's API sometimes returns instead of a real
// astronomy picture (generic site logo + boilerplate caption). Compared
// case-insensitively against the entry title.
const BLOCKED_TITLES = new Set(["nasa science"]);

function looksLikeRealApod(data) {
  if (!data || !data.title || !data.explanation || !data.url) return false;
  if (BLOCKED_TITLES.has(String(data.title).trim().toLowerCase())) return false;
  return data.media_type === "image" || data.media_type === "video";
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

  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  let lastError = "No valid APOD entry found";
  let lastStatus = 502;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const date = randomDate();
    try {
      const res = await fetchWithTimeout(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}&thumbs=true`,
        FETCH_TIMEOUT_MS
      );

      if (res.status === 429) {
        // Quota exhausted — more attempts will only make it worse
        return NextResponse.json(
          { error: "NASA API rate limit reached. Try again in a bit." },
          { status: 429 }
        );
      }

      if (!res.ok) {
        lastError = `NASA API request failed (status ${res.status})`;
        continue;
      }

      const data = await res.json();
      if (looksLikeRealApod(data)) {
        return NextResponse.json(data);
      }

      // Logged so rejected entries show up in Vercel's runtime logs
      console.warn("APOD entry rejected", {
        date,
        title: data?.title,
        media_type: data?.media_type,
        url: data?.url
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
