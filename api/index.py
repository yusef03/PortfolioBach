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

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
         raise HTTPException(status_code=500, detail="Gemini API Key missing in Environment Variables")
    
    try:
        system_instruction = load_system_prompt()
        
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
            if e.code in [503, 429, 404]: 
                print(f"Model Overloaded ({e.code}), failing over to gemini-2.5-flash-lite...")
                try:
                    response_data = call_gemini('gemini-2.5-flash-lite')
                except urllib.error.HTTPError as e2:
                    print(f"Model Overloaded again ({e2.code}), failing over to gemini-2.0-flash...")
                    try:
                        response_data = call_gemini('gemini-2.0-flash')
                    except urllib.error.HTTPError as e3:
                        print(f"Last lifeline ({e3.code}), falling back to gemini-2.0-flash-lite...")
                        response_data = call_gemini('gemini-2.0-flash-lite')
            else:
                raise e

        text_answer = response_data['candidates'][0]['content']['parts'][0]['text']
        return {"answer": text_answer}

    except urllib.error.HTTPError as e:
        error_info = e.read().decode('utf-8')
        print(f"Gemini API Direct Error: {e.code} - {error_info}")
        raise HTTPException(status_code=500, detail="Der AI-Twin ist momentan nicht erreichbar.")
    except Exception as e:
        print(f"API System Error: {e}")
        raise HTTPException(status_code=500, detail="Der AI-Twin ist momentan nicht erreichbar.")
