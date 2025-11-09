import { useState } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/chat`, {
        message: input,
        model: "gpt-4",
      });

      const reply = response.data.reply || "No response received.";
      const aiMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error contacting AI:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>🤖 ChatKin AI</h1>
        <p>
          Created by <b>Akin Saye Sokpah</b> —{" "}
          <a href="mailto:sokpahakinsaye81@gmail.com">sokpahakinsaye81@gmail.com</a> |{" "}
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">
            Facebook
          </a>
        </p>
      </header>

      <main className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </main>

      <footer className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </footer>
    </div>
  );
}
