// ✅ ChatKin AI Backend — Fixed version
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Use built-in global fetch in Node.js 18+ (no need for node-fetch)
dotenv.config();

const app = express();
app.use(express.json());

// 🧠 Auto-detect correct directory (Render-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ✅ MAIN CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "⚠️ Missing OpenAI API key on server." });
    }

    // 🧠 Use built-in fetch (no need for node-fetch)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are ChatKin AI, a helpful and intelligent assistant created by Akin Saye Sokpah." },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error("OpenAI API error:", data);
      res.json({ reply: "⚠️ OpenAI API error occurred. Please try again." });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.json({ reply: "⚠️ ChatKin AI backend error occurred." });
  }
});

// ✅ Serve frontend (React/Vite build)
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ ChatKin AI backend is running successfully on port ${PORT}`));
