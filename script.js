const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const modelSelect = document.getElementById("model");
const themeToggle = document.getElementById("theme-toggle");
const newChatBtn = document.getElementById("new-chat");
const chatHistory = document.getElementById("chat-history");

let darkMode = true;
let chats = JSON.parse(localStorage.getItem("chatkin_chats") || "[]");
let currentChat = { id: Date.now(), messages: [] };

loadChatHistory();
renderChat(currentChat);

themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("light", !darkMode);
  themeToggle.textContent = darkMode ? "🌙 Dark" : "🌞 Light";
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

newChatBtn.addEventListener("click", () => {
  currentChat = { id: Date.now(), messages: [] };
  renderChat(currentChat);
});

function loadChatHistory() {
  chatHistory.innerHTML = "";
  chats.forEach(chat => {
    const div = document.createElement("div");
    div.classList.add("chat-item");
    div.textContent = chat.messages[0]?.text?.slice(0, 30) || "New Chat";
    div.onclick = () => renderChat(chat);
    chatHistory.appendChild(div);
  });
}

function renderChat(chat) {
  chatBox.innerHTML = "";
  chat.messages.forEach(m => addMessage(m.sender, m.text, false));
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  currentChat.messages.push({ sender: "user", text });
  userInput.value = "";

  const typing = addMessage("ai", "ChatKin is typing...", true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, model: modelSelect.value }),
    });

    const data = await res.json();
    typing.remove();

    const reply = data.reply || "⚠️ ChatKin AI could not process your request.";
    addMessage("ai", reply);
    currentChat.messages.push({ sender: "ai", text: reply });

    saveChats();
  } catch (err) {
    typing.remove();
    addMessage("ai", "⚠️ Server unreachable. Try again later.");
  }
}

function addMessage(sender, text, typing = false) {
  const div = document.createElement("div");
  div.classList.add("message", sender, "fade-in");
  if (typing) div.classList.add("typing");
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

function saveChats() {
  const existing = chats.filter(c => c.id !== currentChat.id);
  chats = [currentChat, ...existing];
  localStorage.setItem("chatkin_chats", JSON.stringify(chats));
  loadChatHistory();
}
