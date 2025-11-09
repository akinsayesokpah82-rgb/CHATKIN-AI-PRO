import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://chatkin-ai-vf6v.onrender.com";

export default function App() {
  const [input, setInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [model, setModel] = useState("gpt-4-turbo");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: input,
        model,
      });
      setAiResponse(res.data.reply);
    } catch (err) {
      setAiResponse("🚧 ChatKin AI is temporarily unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🤖 ChatKin AI</h1>
      <p>
        Created by <b>Akin Saye Sokpah</b> —{" "}
        <a href="mailto:sokpahakinsaye81@gmail.com">sokpahakinsaye81@gmail.com</a>{" "}
        |{" "}
        <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">
          Facebook
        </a>
      </p>

      <div className="model-selector">
        <label>AI Model:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4-turbo">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
        </select>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {aiResponse && (
        <div className="response">
          <h3>AI:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
