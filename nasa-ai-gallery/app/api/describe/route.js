import OpenAI from "openai";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";

export async function POST(req) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`describe:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please wait a moment before trying again."
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { title, explanation, date } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing GROQ_API_KEY on server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });

  const prompt = `You are a witty space-obsessed science communicator. Given this NASA Astronomy Picture of the Day, write a short, engaging, factually accurate description (3-4 sentences, no headers, no markdown) that adds context or a fun fact beyond NASA's own caption. Make it feel fresh, not a repeat of the original text.

Title: ${title}
Date: ${date}
NASA's original caption: ${explanation}`;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let sentAny = false;
      try {
        const completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [{ role: "user", content: prompt }],
          stream: true
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            sentAny = true;
            controller.enqueue(encoder.encode(text));
          }
        }

        if (!sentAny) {
          controller.enqueue(
            encoder.encode(
              "[No description returned — this can happen if the free-tier rate limit was hit. Try Shuffle again in a moment.]"
            )
          );
        }
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(`[Error generating description: ${err.message}]`)
        );
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
}
