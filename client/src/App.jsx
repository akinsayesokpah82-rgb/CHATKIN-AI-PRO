import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, model }),
      });

      const data = await res.json();

      if (data.reply) {
        setChat([...newChat, { role: "assistant", content: data.reply }]);
      } else {
        setChat([
          ...newChat,
          { role: "assistant", content: "⚠️ ChatKin AI server error." },
        ]);
      }
    } catch (err) {
      setChat([
        ...newChat,
        { role: "assistant", content: "⚠️ Server unreachable. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 ChatKin AI</h1>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </header>

      <main className="chat-window">
        {chat.length === 0 ? (
          <div className="welcome">
            👋 Hi, I’m <b>ChatKin AI</b>. How can I help you today?
          </div>
        ) : (
          chat.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <strong>{msg.role === "user" ? "You" : "🤖 ChatKin AI"}:</strong>{" "}
              <span>{msg.content}</span>
            </div>
          ))
        )}

        {loading && (
          <div className="message assistant">
            <strong>🤖 ChatKin AI:</strong> <span>Typing...</span>
          </div>
        )}
      </main>

      <form onSubmit={sendMessage} className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </form>

      <footer className="footer">
        Created by <strong>Akin Saye Sokpah</strong> —{" "}
        <a
          href="https://www.facebook.com/profile.php?id=61583456361691"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      </footer>
    </div>
  );
}

export default App;
