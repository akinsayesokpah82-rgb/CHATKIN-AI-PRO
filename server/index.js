const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: model || "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are ChatKin AI, a helpful assistant." },
      { role: "user", content: message },
    ],
    max_tokens: 300,
  }),
});
