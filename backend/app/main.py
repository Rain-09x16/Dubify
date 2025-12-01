"""
Dubai Navigator AI - FastAPI Backend
Main application file

This is the entry point for our FastAPI backend.
FastAPI is a modern Python web framework for building APIs.

Think of this file as the "brain" that connects everything together.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import our API routers
from app.api import chat, search, safety

app = FastAPI(
    title="Dubai Navigator AI API",
    description="AI-powered tourism companion backend with Gemini 2.5 Flash",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dubify-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
# This connects our endpoints to the main app
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(safety.router, prefix="/api", tags=["Safety"])

@app.get("/")
async def root():
    return {
        "message": "Dubai Navigator AI Backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "search": "/api/search",
            "safety": "/api/safety",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Dubai Navigator AI"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
