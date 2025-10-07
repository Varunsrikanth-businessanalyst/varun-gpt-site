// Netlify Function: /.netlify/functions/ask
export default async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. If the user asks about Varun Srikanth, answer briefly and professionally. If it's general knowledge (math, geography, etc.), just answer normally."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    const data = await r.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry — I couldn't generate a response.";

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
