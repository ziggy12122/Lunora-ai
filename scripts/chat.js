const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");
const chatHistoryList = document.getElementById("chat-history");
const newChatBtn = document.getElementById("new-chat");

let chatHistory = JSON.parse(localStorage.getItem("lumora_chats")) || [];
let currentChat = [];

function renderMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveChat() {
  if (currentChat.length > 0) {
    chatHistory.push(currentChat);
    localStorage.setItem("lumora_chats", JSON.stringify(chatHistory));
    renderHistory();
  }
}

function renderHistory() {
  chatHistoryList.innerHTML = "";
  chatHistory.forEach((chat, i) => {
    const li = document.createElement("li");
    li.textContent = `Chat #${i + 1}`;
    li.onclick = () => loadChat(i);
    chatHistoryList.appendChild(li);
  });
}

function loadChat(index) {
  chatWindow.innerHTML = "";
  currentChat = [...chatHistory[index]];
  currentChat.forEach(entry => {
    renderMessage(entry.sender, entry.text);
  });
}

async function fetchAIResponse(prompt) {
  try {
    const response = await fetch("https://huggingface.co/spaces/Zpofeee/GPT4ALL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [prompt] })
    });
    const result = await response.json();
    return result?.data?.[0] || "Hmm… I’m not sure how to answer that yet.";
  } catch (err) {
    console.error("API error:", err);
    return "⚠️ Lumora couldn't connect to the stars right now.";
  }
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = chatInput.value.trim();
  if (!userInput) return;

  renderMessage("user", userInput);
  currentChat.push({ sender: "user", text: userInput });
  chatInput.value = "";

  // Get real AI response from backend
  const reply = await fetchAIResponse(userInput);
  renderMessage("ai", reply);
  currentChat.push({ sender: "ai", text: reply });
});

newChatBtn.onclick = () => {
  saveChat();
  currentChat = [];
  chatWindow.innerHTML = "";
};

renderHistory();