from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Constants
SYSTEM_PROMPT = """You are a compassionate healthcare chatbot specializing in HPV risk assessment.
Your role is to:
1. Gather information about risk factors sensitively.
2. Show empathy and understanding.
3. Track key variables: sexual history, protection practices, smoking status, age of first intercourse.
4. Avoid medical advice - refer to healthcare providers.
5. Maintain professional boundaries while being approachable.
6. Be highly empathetic to make users feel comfortable expressing private concerns."""

LLAMA_API_URL = "http://127.0.0.1:11434/v1/chat/completions"  # Adjust URL if needed

# CORS configuration to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to handle incoming message payload
class Prompt(BaseModel):
    messages: list

@app.post("/api/chat")
async def chat_with_bot(prompt: Prompt):
    if not prompt.messages:
        raise HTTPException(status_code=400, detail="Messages are required")

    # Prepare the payload for Llama API
    payload = {
        "model": "llama2-13b-chat",  # Ensure this matches the model you're using
        "inputs": [{"role": "system", "content": SYSTEM_PROMPT}, *prompt.messages],
        "parameters": {"temperature": 0.7, "max_tokens": 150}
    }

    try:
        response = requests.post(LLAMA_API_URL, json=payload)
        response.raise_for_status()
        data = response.json()

        # Check if the response contains the expected structure
        if "choices" in data and len(data["choices"]) > 0:
            message = data["choices"][0]["message"]["content"]
        else:
            raise HTTPException(status_code=500, detail="Invalid response structure from Llama API")

        return {"message": message}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error from Llama API: {str(e)}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Health Chat Assistant API!"}