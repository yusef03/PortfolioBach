import os
import json
import urllib.request
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Ask Yusef API", version="1.0")

# CORS-Config (Erlaubt Anfragen von jedem Origin – Für Produktion auf github.io/deineDomain einschränken!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# Lese yusef_brain.md als System-Prompt ein
def load_system_prompt():
    # api/index.py liegt in /api, yusef_brain.md im Root.
    brain_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'yusef_brain.md')
    try:
        with open(brain_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error loading system prompt: {e}")
        return "Du bist der virtuelle AI-Assistent von Yusef Bach. Antworte in der Ich-Form."

class ChatRequest(BaseModel):
    query: str
    lang: str = "de"

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
         raise HTTPException(status_code=500, detail="Gemini API Key missing in Environment Variables")

    try:
        base_prompt = load_system_prompt()
        lang_instruction = (
            "CRITICAL LANGUAGE RULE: The user has their browser set to English. You MUST respond in English only. "
            "Every single word of your reply must be in English.\n\n"
            if request.lang == "en"
            else "CRITICAL LANGUAGE RULE: The user has their browser set to German. You MUST respond in German only. "
            "Every single word of your reply must be in German.\n\n"
        )
        system_instruction = lang_instruction + base_prompt
        
        def call_gemini(model_name):
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "systemInstruction": {"parts": [{"text": system_instruction}]},
                "contents": [{"parts": [{"text": request.query}]}]
            }
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req) as response:
                return json.loads(response.read().decode('utf-8'))
        
        # Zero-Dependency REST-Call with Failover Architecture (Modern 2.x/3.x Stack)
        try:
            response_data = call_gemini('gemini-2.5-flash')
        except urllib.error.HTTPError as e:
            if e.code in [503, 404]: 
                print(f"Model Overloaded ({e.code}), failing over to gemini-2.5-flash-lite...")
                try:
                    response_data = call_gemini('gemini-2.5-flash-lite')
                except urllib.error.HTTPError as e2:
                    if e2.code == 429: raise e2
                    print(f"Model Overloaded again ({e2.code}), failing over to gemini-2.0-flash...")
                    try:
                        response_data = call_gemini('gemini-2.0-flash')
                    except urllib.error.HTTPError as e3:
                        if e3.code == 429: raise e3
                        print(f"Last lifeline ({e3.code}), falling back to gemini-2.0-flash-lite...")
                        response_data = call_gemini('gemini-2.0-flash-lite')
            else:
                raise e

        text_answer = response_data['candidates'][0]['content']['parts'][0]['text']
        return {"answer": text_answer}

    except urllib.error.HTTPError as e:
        error_info = e.read().decode('utf-8')
        print(f"Gemini Rate Limit / API Error: {e.code}")
        is_en = getattr(request, 'lang', 'de') == 'en'
        if e.code == 429:
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
        is_en = getattr(request, 'lang', 'de') == 'en'
        return {"answer": (
            "There was a problem starting up my systems. Please use the regular contact form for now!"
            if is_en else
            "Es gab ein Problem beim Hochfahren meiner Systeme. Bitte benutze vorerst das reguläre Kontaktformular!"
        )}
