"""
Chat API Endpoint
Handles AI chatbot requests

This file defines the /api/chat endpoint.
When the frontend sends a message, this is where it arrives.
"""

from fastapi import APIRouter, HTTPException, status
from app.models.schemas import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

# Create a router - this groups related endpoints together
# APIRouter is like a mini-app that can be plugged into the main app
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with AI Assistant

    This endpoint:
    1. Receives user's message
    2. Sends it to Gemini AI
    3. Returns AI's response

    Args:
        request: ChatRequest object with message and user_id

    Returns:
        ChatResponse with AI's answer

    Example:
        POST /api/chat
        {
            "message": "What's the best time to visit Dubai?",
            "user_id": "user_123"
        }

        Response:
        {
            "success": true,
            "response": "The best time to visit Dubai is November to March..."
        }
    """
    try:
        # Extract the message and history from the request
        user_message = request.message
        conversation_history = request.history

        # Send to Gemini AI service
        # The 'await' keyword means "wait for this to finish before continuing"
        ai_response = await gemini_service.chat(
            message=user_message,
            history=conversation_history
        )

        # Return successful response
        return ChatResponse(
            success=True,
            response=ai_response
        )

    except Exception as e:
        # If something goes wrong, return error response
        print(f"Chat endpoint error: {str(e)}")

        # HTTPException is a special FastAPI error that gets
        # automatically converted to an HTTP error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat request: {str(e)}"
        )
