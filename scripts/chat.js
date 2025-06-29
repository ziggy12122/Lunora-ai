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

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = chatInput.value.trim();
  if (!userInput) return;
  renderMessage("user", userInput);
  currentChat.push({ sender: "user", text: userInput });
  chatInput.value = "";

  // Simulated response
  setTimeout(() => {
    const reply = "🌕 Lumora says: " + generateMockReply(userInput);
    renderMessage("ai", reply);
    currentChat.push({ sender: "ai", text: reply });
  }, 600);
});

newChatBtn.onclick = () => {
  saveChat();
  currentChat = [];
  chatWindow.innerHTML = "";
};

function generateMockReply(input) {
  const phrases = ["Fascinating thought!", "Here's what I found:", "Let me explain…", "That's a stellar question!"];
  return phrases[Math.floor(Math.random() * phrases.length)] + " " + input;
}

renderHistory();