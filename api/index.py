import os
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Ask Yusef API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yusefbach.de", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


def load_system_prompt() -> str:
    paths_to_try = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "yusef_brain.md"),
        os.path.join(os.getcwd(), "yusef_brain.md"),
        os.path.join(os.path.dirname(__file__), "yusef_brain.md"),
    ]
    for path in paths_to_try:
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return f.read()
        except Exception as e:
            print(f"Error reading {path}: {e}")
    print("WARNING: yusef_brain.md not found — using fallback prompt.")
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

    lang_prefix = (
        "CRITICAL LANGUAGE RULE: Respond in English only. Every word must be English.\n\n"
        if body.lang == "en"
        else "CRITICAL LANGUAGE RULE: Antworte ausschließlich auf Deutsch. Jedes Wort muss Deutsch sein.\n\n"
    )
    system_instruction = lang_prefix + load_system_prompt()

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

    is_en = body.lang == "en"
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

    if response_data is None:
        if last_status == 429:
            return {"answer": (
                "My free Google API quota is exhausted for now. Reach out to Yusef directly via LinkedIn or the contact form!"
                if is_en else
                "Mein kostenloses Google API-Limit ist gerade ausgeschöpft. Schreib Yusef direkt über LinkedIn oder das Kontaktformular!"
            )}
        return {"answer": (
            "My connection to the AI servers hiccuped. Try again in a moment or contact Yusef directly!"
            if is_en else
            "Meine Verbindung zu den AI-Servern hat einen Schluckauf. Versuch es gleich nochmal oder kontaktiere Yusef direkt!"
        )}

    try:
        text_answer = response_data["candidates"][0]["content"]["parts"][0]["text"]
        return {"answer": text_answer}
    except (KeyError, IndexError) as e:
        print(f"Unexpected Gemini response shape: {e} — {response_data}")
        return {"answer": (
            "I received an unexpected response from the AI. Please try again!"
            if is_en else
            "Ich habe eine unerwartete Antwort vom AI erhalten. Bitte versuch es nochmal!"
        )}
