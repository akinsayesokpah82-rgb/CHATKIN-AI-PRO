import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [typingText, setTypingText] = useState("");

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // Typing animation effect
  useEffect(() => {
    if (!loading || chat.length === 0) return;
    const typingMsg = "Typing...";
    let index = 0;
    const interval = setInterval(() => {
      setTypingText(typingMsg.slice(0, index + 1));
      index++;
      if (index > typingMsg.length) {
        index = 0;
      }
    }, 150);
    return () => clearInterval(interval);
  }, [loading, chat]);

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
    } catch {
      setChat([
        ...newChat,
        { role: "assistant", content: "⚠️ Server unreachable. Try again later." },
      ]);
    } finally {
      setLoading(false);
      setTypingText("");
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>🤖 ChatKin AI</h1>
        <div className="controls">
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
          </select>
          <button onClick={toggleTheme}>
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
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
            <strong>🤖 ChatKin AI:</strong> <span>{typingText}</span>
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
