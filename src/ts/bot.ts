/* ==========================================================================
   RAG AI-BOT CONTROLLER (Vanilla JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const currentLang: string = localStorage.getItem("language") || "de";
  const isEn = currentLang === "en";

  const i18n = {
    greeting: isEn
      ? "Hi! I'm Yusef's AI Twin. Ask me anything about his skills, projects, or experience."
      : "Hi! Ich bin der AI-Twin von Yusef. Frag mich gerne etwas zu seinen Skills, Projekten oder Erfahrungen.",
    placeholder: isEn ? "Write a message..." : "Schreibe eine Nachricht...",
    thinking: isEn ? "Yusef-Twin is thinking..." : "Yusef-Twin denkt nach...",
    fallback: isEn
      ? [
          "Oh, connection to the AI servers hiccuped. If you'd like to know more about Yusef, reach out directly or explore the project case studies!",
          "Quick API timeout — but here's what I know: Yusef is a passionate developer who loves solving architectural challenges. Contact him directly!",
          "The serverless line is busy today. In the meantime, check out the Community Software project — Yusef is especially proud of that one!"
        ]
      : [
          "Oh, meine Verbindung zu den Google AI-Servern hat gerade einen Schluckauf. Wenn du Genaueres über Yusef wissen willst, schreib ihm direkt oder schau in die Projekt-Cases!",
          "Hmm, kurzes API-Timeout. Was ich dir sagen kann: Yusef ist ein sehr enthusiastischer Entwickler und liebt es, architektonische Probleme zu lösen. Kontaktier ihn gerne direkt!",
          "Die Serverless-Leitung glüht heute. In der Zwischenzeit kannst du ja mal in das Projekt 'Community Software' reinschauen, darauf ist Yusef besonders stolz!"
        ],
  };

  // 1. INJECT BOT HTML DYNAMICALLY ON ANY PAGE
  if (!document.getElementById("rag-bot-wrapper")) {
    const botHTML = `
      <div id="rag-bot-wrapper">
        <div id="rag-chat-window" class="glass-panel hidden">
          <div class="chat-header">
            <div class="header-info">
              <span class="online-dot"></span>
              <h4>Ask Yusef (AI Twin)</h4>
            </div>
            <button id="rag-close-btn">&times;</button>
          </div>
          <div id="rag-chat-messages" class="chat-body">
            <div class="msg bot-msg">${i18n.greeting}</div>
          </div>
          <div class="chat-footer">
            <input type="text" id="rag-chat-input" placeholder="${i18n.placeholder}" />
            <button id="rag-send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
        <button id="rag-fab-btn" aria-label="Open Chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", botHTML);
  }

  const fabBtn = document.getElementById("rag-fab-btn");
  const chatWindow = document.getElementById("rag-chat-window");
  const closeBtn = document.getElementById("rag-close-btn");
  const sendBtn = document.getElementById("rag-send-btn");
  const inputField = document.getElementById("rag-chat-input") as HTMLInputElement;
  const messagesContainer = document.getElementById("rag-chat-messages");

  const backendUrl = "https://portfolio-bach-seven.vercel.app/api/chat";

  if (!fabBtn) return;

  fabBtn.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
  closeBtn.addEventListener("click", () => chatWindow.classList.add("hidden"));

  sendBtn.addEventListener("click", handleSend);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  async function handleSend() {
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage("user", userText);
    inputField.value = "";

    const loadingId = appendMessage("bot", i18n.thinking, true);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, lang: currentLang })
      });

      if (!response.ok) throw new Error("Backend Error");

      const data = await response.json();
      removeMessage(loadingId);
      appendMessage("bot", data.answer);

    } catch (error) {
      console.error("RAG Integration Error:", error);
      removeMessage(loadingId);
      const reply = i18n.fallback[Math.floor(Math.random() * i18n.fallback.length)];
      appendMessage("bot", reply);
    }
  }

  // DOM Helper: Append Message
  function appendMessage(sender: string, text: string, isLoading: boolean = false) {
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
  function removeMessage(id: string) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});
