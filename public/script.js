const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const modelSelect = document.getElementById("model");
const themeToggle = document.getElementById("theme-toggle");

let darkMode = true;

themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.style.background = darkMode ? "#0d1117" : "#f2f2f2";
  document.body.style.color = darkMode ? "#fff" : "#000";
  themeToggle.textContent = darkMode ? "🌞 Light" : "🌙 Dark";
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        model: modelSelect.value,
      }),
    });

    const data = await res.json();
    addMessage("ai", data.reply || "⚠️ ChatKin AI could not process your request.");
  } catch (err) {
    addMessage("ai", "⚠️ Server unreachable. Try again later.");
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
