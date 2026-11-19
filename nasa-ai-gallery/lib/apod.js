// Normalizes entries from NASA's new APOD endpoint
// (https://science.nasa.gov/wp-json/wp/v2/apod-basic/YYMMDD) into the shape
// the frontend expects: { title, date, explanation, media_type, url, ... }.
//
// NASA moved APOD to science.nasa.gov on 2026-09-29. The legacy
// api.nasa.gov/planetary/apod endpoint now returns a "NASA Science"
// placeholder for every date and is scheduled to be archived 2026-12-01.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// Placeholder titles that mean "not a real picture"
const BLOCKED_TITLES = new Set(["nasa science"]);

function fromCode(n) {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
}

export function htmlToText(html) {
  if (html == null) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, n) => fromCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => fromCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstMatch(html, re) {
  const m = re.exec(html || "");
  return m ? m[1] : null;
}

const IMG_RE = /<img[^>]+src=["']([^"']+)["']/i;
const IFRAME_RE = /<iframe[^>]+src=["']([^"']+)["']/i;

function toHttps(u) {
  if (!u) return null;
  let s = String(u).trim().replace(/&#0?38;|&amp;/g, "&");
  if (s.startsWith("//")) s = "https:" + s;
  try {
    const url = new URL(s);
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

function imageUrl(u) {
  const url = toHttps(u);
  if (!url) return null;
  // NASA's image CDN serves resized versions; ask for a larger one
  if (url.pathname.includes("/dynamicimage/") && url.searchParams.has("w")) {
    url.searchParams.set("w", "1280");
    url.searchParams.set("h", "1280");
    url.searchParams.set("fit", "clip");
  }
  return url.toString();
}

function embedUrl(u) {
  const url = toHttps(u);
  return url ? url.toString() : null;
}

export function normalizeApod(raw) {
  if (!raw || typeof raw !== "object") return null;

  const title = htmlToText(raw.title);
  const explanation = htmlToText(raw.explanation).replace(/^Explanation:\s*/i, "");
  if (!title || !explanation) return null;
  if (BLOCKED_TITLES.has(title.toLowerCase())) return null;

  const isVideo = raw.media_type === "video";
  const url = isVideo
    ? embedUrl(firstMatch(raw.basic_html, IFRAME_RE))
    : imageUrl(raw.hdurl) || imageUrl(firstMatch(raw.basic_html, IMG_RE));
  if (!url) return null;

  return {
    title,
    date: raw.date || null,
    explanation,
    media_type: isVideo ? "video" : "image",
    url,
    credit: htmlToText(raw.credit),
    permalink: raw.permalink || null
  };
}
