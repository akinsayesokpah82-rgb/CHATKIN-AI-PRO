import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handle message from client
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content required." });
    }

    const response = await openai.chat.completions.create({
      model: model || "gpt-4",
      messages: [
        { role: "system", content: "You are ChatKin AI, a helpful assistant created by Akin Saye Sokpah." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error processing the AI request." });
  }
});

// Serve frontend (client build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

// Fallback route (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Render assigns PORT dynamically
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ ChatKin AI server running on port ${PORT}`);
});
