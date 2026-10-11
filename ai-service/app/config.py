
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://127.0.0.1:11434"
).rstrip("/")

CHAT_MODEL = os.getenv("CHAT_MODEL", "qwen3:4b")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "bge-m3")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "")