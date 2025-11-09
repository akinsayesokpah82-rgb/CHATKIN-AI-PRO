import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://chatkin-ai-vf6v.onrender.com"; // your backend

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [model, setModel] = useState("gpt-4"); // default model

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setServerError(false);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Error:", err);
      setServerError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🚧 ChatKin AI is temporarily unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="text-center py-3 border-b border-gray-800 bg-gray-900 shadow">
        <h1 className="text-2xl font-bold text-purple-400">🤖 ChatKin AI</h1>
        <p className="text-sm text-gray-400">
          Created by <strong>Akin Saye Sokpah</strong> —{" "}
          <a
            href="mailto:sokpahakinsaye81@gmail.com"
            className="text-blue-400 hover:underline"
          >
            sokpahakinsaye81@gmail.com
          </a>{" "}
          |{" "}
          <a
            href="https://www.facebook.com/profile.php?id=61583456361691"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            Facebook
          </a>
        </p>

        {/* Model Selector */}
        <div className="mt-2">
          <label className="text-gray-300 text-sm mr-2">AI Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
          </select>
        </div>
      </header>

      {/* Chat section */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <p className="text-gray-400 text-sm animate-pulse">
            ChatKin AI is thinking...
          </p>
        )}
      </main>

      {/* Input bar */}
      <footer className="p-3 bg-gray-900 border-t border-gray-800 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ChatKin AI (${model})...`}
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700 transition"
        >
          {loading ? "..." : "Send"}
        </button>
      </footer>

      {/* Full-screen offline message */}
      {serverError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center p-6">
          <h2 className="text-xl font-semibold mb-2">🚧 Server Offline</h2>
          <p className="text-gray-300 mb-3">
            ChatKin AI is temporarily unavailable. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            Reload
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
