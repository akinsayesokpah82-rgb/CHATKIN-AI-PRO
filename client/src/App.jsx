import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "👋 Hi, I’m ChatKin AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

      setMessages([...newMessages, { role: "ai", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "ai", content: "⚠️ Unable to reach ChatKin AI right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
        🤖 ChatKin AI
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4-turbo">GPT-4</option>
        </select>
      </header>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <span>{m.content}</span>
          </div>
        ))}

        {loading && (
          <div className="msg ai typing">
            <span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
