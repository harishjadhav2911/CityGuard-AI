from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = BACKEND_DIR / "cityguard.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "CITYGUARD AI"
    VERSION: str = "1.0.0"
    TAGLINE: str = "Predict Risks. Simulate Responses. Protect Lives."
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    GEMINI_API_KEY: str = ""

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

    def get_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("sqlite:///./"):
            relative_part = url[len("sqlite:///./"):]
            return f"sqlite:///{(BACKEND_DIR / relative_part).as_posix()}"
        return url

settings = Settings()

