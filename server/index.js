import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Free Proxy API (no card needed)
const PROXY_API = "https://api.gpt-proxy.online/v1/chat/completions";

// Chat route
app.post("/api/chat", async (req, res) => {
  const { message, model } = req.body;

  try {
    const response = await fetch(PROXY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "⚠️ No response from AI.";
    res.json({ reply });
  } catch (error) {
    console.error("Error fetching from proxy:", error);
    res.status(500).json({ reply: "⚠️ ChatKin AI server error." });
  }
});

// ✅ Serve frontend from server/public (where vite build outputs)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "server", "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "server", "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ChatKin AI running on port ${PORT}`));
