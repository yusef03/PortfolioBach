import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

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
        # Neues GenAI SDK Initialisieren
        client = genai.Client(api_key=api_key)
        system_instruction = load_system_prompt()
        
        # Generiere die Antwort
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=request.query,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            )
        )
        
        return {"answer": response.text}

    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail="Der AI-Twin ist momentan nicht erreichbar.")
