import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("🧠 ChatKin AI backend is running successfully!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "⚠️ Missing OpenAI API key." });
    }

    const response = await openai.chat.completions.create({
      model: model || "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are ChatKin AI, created by Akin Saye Sokpah." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      reply: "🚧 ChatKin AI is temporarily unavailable. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`✅ ChatKin AI server running on ${PORT}`)
);
