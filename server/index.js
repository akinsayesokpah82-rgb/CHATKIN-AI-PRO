import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend (Vite build output)
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "AI service error" });
  }
});

// ✅ All other routes → serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ ChatKin AI server running on ${PORT}`);
});
