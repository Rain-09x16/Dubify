"""
Configuration File
Stores all environment variables and settings

This file reads environment variables from .env file
and makes them available throughout the application.
"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Application Settings
    
    Pydantic automatically reads these from environment variables
    or from a .env file in the project root.
    """
    
    # Google Gemini API
    GEMINI_API_KEY: str
    
    # Qdrant Vector Database (optional)
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None
    
    # Clerk Authentication
    CLERK_SECRET_KEY: str
    
    # Application Settings
    APP_NAME: str = "Dubai Navigator AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Origins (comma-separated list)
    CORS_ORIGINS: str = "http://localhost:3000,https://dubify-five.vercel.app"
    
    class Config:
        # Tell Pydantic to read from .env file
        env_file = ".env"
        case_sensitive = True

# Create a single instance of settings
# This will be imported and used throughout the app
settings = Settings()
