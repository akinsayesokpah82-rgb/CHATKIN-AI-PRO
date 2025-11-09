import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// 🧠 Auto-detect correct directory (Render-friendly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ✅ MAIN CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      console.error("🚨 Missing OpenAI API key in environment.");
      return res.json({ reply: "⚠️ Missing OpenAI API key on server." });
    }

    console.log("🧠 Incoming message:", message);

    // Use the native Node fetch (Node 18+)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are ChatKin AI, a helpful assistant." },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      console.log("✅ OpenAI reply:", data.choices[0].message.content);
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error("🧩 OpenAI API Error:", data);
      res.json({ reply: "⚠️ ChatKin AI could not process your request." });
    }
  } catch (err) {
    console.error("🔥 ChatKin AI Server Error:", err);
    res.status(500).json({ reply: "⚠️ ChatKin AI backend error." });
  }
});

// ✅ Serve frontend (after build)
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ ChatKin AI server running on port ${PORT}`));
