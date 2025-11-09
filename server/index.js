import express from "express";
import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- OPENAI SETUP ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- CHAT ENDPOINT ---
app.post("/api/chat", async (req, res) => {
  const { message, model } = req.body;
  console.log("Received message:", message);

  try {
    const completion = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ reply: aiResponse });
  } catch (err) {
    console.error("❌ Error from OpenAI:", err);
    res.status(500).json({ reply: "⚠️ ChatKin AI server error." });
  }
});

// --- FRONTEND BUILD PATH ---
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ChatKin AI running on port ${PORT}`));
