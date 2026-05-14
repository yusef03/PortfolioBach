import os
import json
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Ask Yusef API", version="1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS-Config (Eingeschränkt auf Produktion und Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yusefbach.de", "http://localhost", "http://127.0.0.1"], 
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# Lese yusef_brain.md als System-Prompt ein
def load_system_prompt():
    paths_to_try = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'yusef_brain.md'),
        os.path.join(os.getcwd(), 'yusef_brain.md'),
        os.path.join(os.path.dirname(__file__), 'yusef_brain.md')
    ]
    
    for path in paths_to_try:
        try:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as file:
                    return file.read()
        except Exception as e:
            print(f"Error reading {path}: {e}")
            
    print("Could not find yusef_brain.md in any of the expected locations.")
    return "Du bist der virtuelle AI-Assistent von Yusef Bach. Antworte in der Ich-Form."

class ChatRequest(BaseModel):
    query: str
    lang: str = "de"

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, body: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
         raise HTTPException(status_code=500, detail="Gemini API Key missing in Environment Variables")

    try:
        base_prompt = load_system_prompt()
        lang_instruction = (
            "CRITICAL LANGUAGE RULE: The user has their browser set to English. You MUST respond in English only. "
            "Every single word of your reply must be in English.\n\n"
            if body.lang == "en"
            else "CRITICAL LANGUAGE RULE: The user has their browser set to German. You MUST respond in German only. "
            "Every single word of your reply must be in German.\n\n"
        )
        system_instruction = lang_instruction + base_prompt
        
        async def call_gemini(model_name):
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "systemInstruction": {"parts": [{"text": system_instruction}]},
                "contents": [{"parts": [{"text": body.query}]}]
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                return response.json()
        
        try:
            response_data = await call_gemini('gemini-2.5-flash')
        except httpx.HTTPStatusError as e:
            if e.response.status_code in [503, 404]: 
                print(f"Model Overloaded ({e.response.status_code}), failing over to gemini-2.5-flash-lite...")
                try:
                    response_data = await call_gemini('gemini-2.5-flash-lite')
                except httpx.HTTPStatusError as e2:
                    if e2.response.status_code == 429: raise e2
                    print(f"Model Overloaded again ({e2.response.status_code}), failing over to gemini-2.0-flash...")
                    try:
                        response_data = await call_gemini('gemini-2.0-flash')
                    except httpx.HTTPStatusError as e3:
                        if e3.response.status_code == 429: raise e3
                        print(f"Last lifeline ({e3.response.status_code}), falling back to gemini-2.0-flash-lite...")
                        response_data = await call_gemini('gemini-2.0-flash-lite')
            else:
                raise e

        text_answer = response_data['candidates'][0]['content']['parts'][0]['text']
        return {"answer": text_answer}

    except httpx.HTTPStatusError as e:
        error_info = e.response.text
        print(f"Gemini Rate Limit / API Error: {e.response.status_code} - {error_info}")
        is_en = getattr(body, 'lang', 'de') == 'en'
        if e.response.status_code == 429:
            return {"answer": (
                "My free Google API quota is exhausted for now. Please reach out to Yusef directly via LinkedIn or the contact form — he usually replies quickly!"
                if is_en else
                "Puh, meine KI-Leitung glüht heute! Mein kostenloses Google API-Limit ist für diesen Moment ausgeschöpft. Schreib Yusef am besten direkt über LinkedIn oder das Kontaktformular, er antwortet in der Regel sofort!"
            )}
        return {"answer": (
            "My connection to the Google AI servers hiccuped. Try again in a moment or contact Yusef directly!"
            if is_en else
            "Puh, meine Serververbindung zu den Google AI-Servern hat gerade einen Schluckauf. Versuch es einfach gleich nochmal oder kontaktiere Yusef direkt!"
        )}
    except Exception as e:
        print(f"API System Error: {e}")
        is_en = getattr(body, 'lang', 'de') == 'en'
        return {"answer": (
            "There was a problem starting up my systems. Please use the regular contact form for now!"
            if is_en else
            "Es gab ein Problem beim Hochfahren meiner Systeme. Bitte benutze vorerst das reguläre Kontaktformular!"
        )}
