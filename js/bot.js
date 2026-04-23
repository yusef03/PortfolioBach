/* ==========================================================================
   RAG AI-BOT CONTROLLER (Vanilla JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const fabBtn = document.getElementById("rag-fab-btn");
  const chatWindow = document.getElementById("rag-chat-window");
  const closeBtn = document.getElementById("rag-close-btn");
  const sendBtn = document.getElementById("rag-send-btn");
  const inputField = document.getElementById("rag-chat-input");
  const messagesContainer = document.getElementById("rag-chat-messages");

  // Deine aktive Vercel URL
  const backendUrl = "https://portfolio-bach-seven.vercel.app/api/chat";

  if (!fabBtn) return; // Prevent errors on subpages if widget is missing

  // Toggle Visibility
  fabBtn.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
  closeBtn.addEventListener("click", () => chatWindow.classList.add("hidden"));

  // Senden per Button oder Enter-Taste
  sendBtn.addEventListener("click", handleSend);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  async function handleSend() {
    const userText = inputField.value.trim();
    if (!userText) return;

    // 1. User-Input ins DOM hängen
    appendMessage("user", userText);
    inputField.value = "";

    // 2. Ladezustand erzeugen
    const loadingId = appendMessage("bot", "Yusef-Twin denkt nach...", true);

    try {
      // 3. FETCH Call an das Vercel Serverless-Backend
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText })
      });

      if (!response.ok) throw new Error("Backend Error");

      const data = await response.json();
      
      // 4. Antwort auslesen und ersetzen
      removeMessage(loadingId);
      appendMessage("bot", data.answer);
      
    } catch (error) {
      console.error("RAG Integration Error:", error);
      removeMessage(loadingId);
      appendMessage("bot", "Ups! Mein Serverless-Backend schläft gerade oder ist unerreichbar.");
    }
  }

  // DOM Helper: Append Message
  function appendMessage(sender, text, isLoading = false) {
    const msgDiv = document.createElement("div");
    const id = "msg-" + Date.now();
    msgDiv.id = id;
    msgDiv.className = `msg ${sender}-msg ${isLoading ? "loading-blink" : ""}`;
    
    // Minimales Markdown-Parsing (für Sterne und Umbrüche der AI)
    let parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsedText = parsedText.replace(/\*/g, '•'); // Listen
    parsedText = parsedText.replace(/\n/g, '<br>'); // Umbrüche

    msgDiv.innerHTML = parsedText;
    messagesContainer.appendChild(msgDiv);
    
    // Auto-Scroll nach unten
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  }

  // DOM Helper: Remove Message
  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});
