import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function ChatKinApp() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi, I’m ChatKin AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Server unreachable. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">🤖 ChatKin AI</h1>
        <div className="flex items-center gap-3">
          <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded p-1 text-sm">
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
          </select>
          <button
            className="px-2 py-1 rounded border"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Chat Section */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">ChatKin is typing...</div>}
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t border-gray-700 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </footer>

      {/* Footer Info */}
      <div className="text-center text-xs py-2 border-t border-gray-800">
        Created by <strong>Akin Saye Sokpah</strong> —{" "}
        <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" className="text-blue-400">
          Facebook
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ChatKinApp />);
