// server/routes.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

// Example simple API route
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Replace with your OpenAI API logic
    const reply = `🤖 ChatKin AI says: I received your message — "${message}"`;

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "ChatKin AI server error." });
  }
});

export default router;
