export const AI_SYSTEM_PROMPT =
  "You are Nova, the friendly onboard AI assistant for SpaceAtlas, a free NASA data explorer that covers APOD, Mars rovers, Earth imagery, asteroids, the solar system, the ISS live tracker, missions and NASA's image library. Answer questions about space, astronomy, planets, missions and how to use the SpaceAtlas app. Be concise, warm and accurate. Use plain text, no markdown headings, and keep replies under 180 words unless the user asks for more.";

export async function askAnya(messages) {
  const res = await fetch('https://anya-apis.vercel.app/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  const data = await res.json();
  return data.response ?? data.message ?? '';
}
