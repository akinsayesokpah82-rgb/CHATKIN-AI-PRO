import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;
    const completion = await client.chat.completions.create({
      model: model || "gpt-4",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Error contacting AI." });
  }
});

// ✅ Serve built React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "public");
app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ ChatKin AI server running on ${PORT}`);
});
