import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";

// APOD archive starts 1995-06-16
const APOD_START = new Date("1995-06-16").getTime();
const FETCH_TIMEOUT_MS = 8000;

function randomDate() {
  const now = Date.now();
  const t = APOD_START + Math.random() * (now - APOD_START);
  return new Date(t).toISOString().slice(0, 10);
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
  const date = randomDate();

  try {
    const res = await fetchWithTimeout(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}&thumbs=true`,
      FETCH_TIMEOUT_MS
    );

    if (!res.ok) {
      const retryDate = randomDate();
      const retryRes = await fetchWithTimeout(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${retryDate}&thumbs=true`,
        FETCH_TIMEOUT_MS
      );
      if (!retryRes.ok) {
        return NextResponse.json(
          { error: `NASA API request failed (status ${retryRes.status})` },
          { status: 502 }
        );
      }
      const retryData = await retryRes.json();
      return NextResponse.json(retryData);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const timedOut = err.name === "AbortError";
    return NextResponse.json(
      {
        error: timedOut
          ? "NASA API timed out"
          : `Failed to reach NASA API: ${err.message}`
      },
      { status: timedOut ? 504 : 500 }
    );
  }
}
