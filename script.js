const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const modelSelect = document.getElementById("model");
const themeToggle = document.getElementById("theme-toggle");

let darkMode = true;

themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("light", !darkMode);
  themeToggle.textContent = darkMode ? "🌙 Dark" : "🌞 Light";
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

  const typing = document.createElement("div");
  typing.classList.add("message", "ai", "typing");
  typing.textContent = "ChatKin is typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

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
    typing.remove();
    addMessage("ai", data.reply || "⚠️ ChatKin AI could not process your request.");
  } catch (err) {
    typing.remove();
    addMessage("ai", "⚠️ Server unreachable. Try again later.");
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender, "fade-in");
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
