import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Multiple fallback proxy APIs (auto-switch if one fails)
const PROXIES = [
  "https://api.gpt-proxy.online/v1/chat/completions",
  "https://api.openai-proxy.com/v1/chat/completions",
  "https://freegptproxy.xyz/v1/chat/completions",
];

// 🧩 Auto-select GPT-4 if user chooses it, else GPT-3.5
async function fetchAIResponse(message, model) {
  for (const proxy of PROXIES) {
    try {
      const response = await fetch(proxy, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model || "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      });

      if (!response.ok) throw new Error(`Proxy failed: ${proxy}`);
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply;
    } catch (err) {
      console.warn(`⚠️ ${proxy} failed, trying next...`);
    }
  }
  return "⚠️ All proxy servers are busy. Please try again later.";
}

app.post("/api/chat", async (req, res) => {
  const { message, model } = req.body;
  const reply = await fetchAIResponse(message, model);
  res.json({ reply });
});

// ✅ Serve frontend correctly
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "server", "public")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "server", "public", "index.html"))
);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ChatKin AI running on port ${PORT}`));
