import os
import time
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Ask Yusef API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yusefbach.de",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5501",   # VS Code Live Server (lokale Beta-Tests)
        "http://localhost:5501",
    ],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# === In-Memory-Cache (5 Min TTL) ===
_brain_cache: dict = {"content": None, "expires_at": 0.0}
_CACHE_TTL_SECONDS = 300  # 5 Minuten


def _load_from_file() -> str | None:
    """Lädt api/yusef_brain.md vom Dateisystem."""
    paths_to_try = [
        os.path.join(os.path.dirname(__file__), "yusef_brain.md"),          # api/yusef_brain.md (primär)
        os.path.join(os.getcwd(), "api", "yusef_brain.md"),                 # falls cwd = repo root
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "yusef_brain.md"),  # legacy root (Fallback)
    ]
    for path in paths_to_try:
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return f.read()
        except Exception as e:
            print(f"File fallback: Error reading {path}: {e}")
    return None


async def load_system_prompt() -> str:
    """
    Lädt den Bot-System-Prompt.
    Reihenfolge: Cache → api/yusef_brain.md → Minimal-Fallback
    """
    global _brain_cache

    # 1. Cache-Check
    if _brain_cache["content"] and time.time() < _brain_cache["expires_at"]:
        return _brain_cache["content"]

    # 2. Datei lesen
    file_content = _load_from_file()
    if file_content:
        _brain_cache = {
            "content": file_content,
            "expires_at": time.time() + _CACHE_TTL_SECONDS,
        }
        print(f"Brain loaded from file ({len(file_content)} chars)")
        return file_content

    # 3. Minimal-Fallback (sollte nie eintreten)
    print("WARNING: Bot brain not found — using minimal fallback prompt")
    return "Du bist der AI-Twin von Yusef Bach. Antworte in der Ich-Form auf Fragen zu Yusef, seinen Projekten und Skills."


class ChatRequest(BaseModel):
    query: str
    lang: str = "de"


FALLBACK_CHAIN = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]


@app.post("/api/chat")
async def chat_endpoint(request: Request, body: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    if body.lang == "en":
        lang_prefix = "CRITICAL LANGUAGE RULE: Respond in English only. Every word must be English.\n\n"
    elif body.lang == "ar":
        lang_prefix = "CRITICAL LANGUAGE RULE: Respond in Arabic (العربية) only. Every word must be Arabic. Use RTL-appropriate phrasing.\n\n"
    else:
        lang_prefix = "CRITICAL LANGUAGE RULE: Antworte ausschließlich auf Deutsch. Jedes Wort muss Deutsch sein.\n\n"
    system_instruction = lang_prefix + await load_system_prompt()

    async def call_gemini(model: str) -> dict:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "contents": [{"parts": [{"text": body.query}]}],
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
            return r.json()

    lang = body.lang  # "de" | "en" | "ar"
    response_data = None
    last_status = 500

    for model in FALLBACK_CHAIN:
        try:
            response_data = await call_gemini(model)
            print(f"Responded via {model}")
            break
        except httpx.HTTPStatusError as e:
            last_status = e.response.status_code
            if last_status == 429:
                break  # quota exhausted — no point retrying other models
            if last_status not in (503, 404):
                break  # unexpected error
            print(f"{model} unavailable ({last_status}), trying next model...")

    # ── Fehlermeldungen (DE / EN / AR) ────────────────────────────────────────
    QUOTA_MSG = {
        "en": "My free Google API quota is exhausted for now. Reach out to Yusef directly via LinkedIn or the contact form!",
        "ar": "لقد استُنفدت حصة Google API المجانية مؤقتاً. تواصل مع يوسف مباشرةً عبر LinkedIn أو نموذج الاتصال!",
    }
    CONN_MSG = {
        "en": "My connection to the AI servers hiccuped. Try again in a moment or contact Yusef directly!",
        "ar": "اتصالي بخوادم الذكاء الاصطناعي تعطّل لحظياً. حاول مرة أخرى بعد قليل أو تواصل مع يوسف مباشرةً!",
    }
    SHAPE_MSG = {
        "en": "I received an unexpected response from the AI. Please try again!",
        "ar": "تلقّيت ردًّا غير متوقع من الذكاء الاصطناعي. يرجى المحاولة مجدداً!",
    }
    DE_QUOTA  = "Mein kostenloses Google API-Limit ist gerade ausgeschöpft. Schreib Yusef direkt über LinkedIn oder das Kontaktformular!"
    DE_CONN   = "Meine Verbindung zu den AI-Servern hat einen Schluckauf. Versuch es gleich nochmal oder kontaktiere Yusef direkt!"
    DE_SHAPE  = "Ich habe eine unerwartete Antwort vom AI erhalten. Bitte versuch es nochmal!"

    if response_data is None:
        if last_status == 429:
            return {"answer": QUOTA_MSG.get(lang, DE_QUOTA)}
        return {"answer": CONN_MSG.get(lang, DE_CONN)}

    try:
        text_answer = response_data["candidates"][0]["content"]["parts"][0]["text"]
        return {"answer": text_answer}
    except (KeyError, IndexError) as e:
        print(f"Unexpected Gemini response shape: {e} — {response_data}")
        return {"answer": SHAPE_MSG.get(lang, DE_SHAPE)}
