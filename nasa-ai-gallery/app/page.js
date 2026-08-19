"use client";

import { useState, useCallback } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [streamingAi, setStreamingAi] = useState(false);
  const [error, setError] = useState(null);

  const streamDescription = useCallback(async (imgData) => {
    setStreamingAi(true);
    setAiText("");
    try {
      const res = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: imgData.title,
          explanation: imgData.explanation,
          date: imgData.date
        })
      });

      if (!res.body) {
        setAiText("Description unavailable.");
        setStreamingAi(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setAiText(full);
      }
    } catch (e) {
      setAiText("Couldn't generate a description right now.");
    } finally {
      setStreamingAi(false);
    }
  }, []);

  const fetchRandom = useCallback(async () => {
    setLoadingImage(true);
    setError(null);
    setImage(null);
    setAiText("");
    try {
      const res = await fetch("/api/apod");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch image");
      setImage(data);
      setLoadingImage(false);
      streamDescription(data);
    } catch (e) {
      setError(e.message);
      setLoadingImage(false);
    }
  }, [streamDescription]);

  return (
    <div className="container">
      <header>
        <h1>🚀 NASA AI Gallery</h1>
        <p className="subtitle">
          Random astronomy imagery, described in real time by AI
        </p>
      </header>

      <div className="card">
        <div className="media-wrap">
          {loadingImage && <span className="skeleton">Loading image…</span>}
          {!loadingImage && image?.media_type === "image" && (
            <img src={image.url} alt={image.title} />
          )}
          {!loadingImage && image?.media_type === "video" && (
            <iframe src={image.url} title={image.title} allowFullScreen />
          )}
          {!loadingImage && !image && !error && (
            <span className="skeleton">Press "Shuffle" to load an image</span>
          )}
          {!loadingImage && !image && error && (
            <div className="fallback">
              <span className="fallback-icon">🛰️</span>
              <p>Couldn't load an image from NASA right now.</p>
            </div>
          )}
        </div>

        {image && (
          <div className="content">
            <h2 className="image-title">{image.title}</h2>
            <div className="image-date">{image.date}</div>

            <span className="ai-label">AI description</span>
            <p className="ai-text">
              {aiText}
              {streamingAi && <span className="cursor" />}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="error">
          {error}
          <button className="retry-inline" onClick={fetchRandom}>
            Try again
          </button>
        </p>
      )}

      <div className="controls">
        <button onClick={fetchRandom} disabled={loadingImage || streamingAi}>
          {loadingImage ? "Loading…" : streamingAi ? "Describing…" : "🔀 Shuffle"}
        </button>
      </div>
    </div>
  );
}
