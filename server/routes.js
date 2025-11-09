// server/routes.js
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in Render settings!
});

router.post("/chat", async (req, res) => {
  const { message, model } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "ChatKin AI server error." });
  }
});

export default router;
