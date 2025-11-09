import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Home route
app.get("/", (req, res) => {
  res.send("🧠 ChatKin AI backend is running successfully!");
});

// Chat route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OpenAI API key." });
    }

    const openAIModel = model || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: [
          {
            role: "system",
            content: `You are ChatKin AI — a helpful, intelligent assistant created by Akin Saye Sokpah (Email: sokpahakinsaye81@gmail.com, Facebook: https://www.facebook.com/profile.php?id=61583456361691). Always reply clearly and respectfully.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply received.";
    res.json({ reply });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
