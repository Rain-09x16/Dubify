"""
Pydantic Models / Schemas
Defines the structure of data in our API

Think of these as "blueprints" that describe what data should look like.
Pydantic automatically validates incoming data against these blueprints.

Example: If ChatRequest expects a 'message' field,
Pydantic will reject requests that don't have it.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional

# ============================================================================
# CHAT MODELS
# ============================================================================

class ChatMessage(BaseModel):
    """
    A single chat message

    Fields:
    - role: Who sent the message ("user" or "assistant")
    - content: The actual message text
    """
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")

class ChatRequest(BaseModel):
    """
    Request body for chat endpoint

    When frontend sends a chat message, it must look like this.

    Example JSON:
    {
        "message": "What's the best time to visit Dubai?",
        "history": [
            {"role": "user", "content": "Hi"},
            {"role": "assistant", "content": "Hello! How can I help?"}
        ],
        "user_id": "user_123"
    }
    """
    message: str = Field(..., min_length=1, description="User's message")
    history: Optional[List[ChatMessage]] = Field(default=None, description="Conversation history")
    user_id: str = Field(..., description="User ID from Clerk")

    class Config:
        # This shows an example in the API documentation
        json_schema_extra = {
            "example": {
                "message": "What are the best restaurants in Dubai Marina?",
                "history": [],
                "user_id": "user_2abc123"
            }
        }

class ChatResponse(BaseModel):
    """
    Response from chat endpoint

    What the backend sends back to the frontend.
    """
    success: bool = Field(..., description="Whether the request succeeded")
    response: Optional[str] = Field(None, description="AI's response")
    error: Optional[str] = Field(None, description="Error message if failed")

# ============================================================================
# SEARCH MODELS
# ============================================================================

class SearchFilters(BaseModel):
    """
    Optional filters for search

    These help narrow down search results.
    """
    category: Optional[str] = Field(None, description="Location category (e.g., 'restaurant', 'attraction')")
    min_price: Optional[int] = Field(None, ge=1, le=4, description="Minimum price level (1-4)")
    max_price: Optional[int] = Field(None, ge=1, le=4, description="Maximum price level (1-4)")
    is_halal: Optional[bool] = Field(None, description="Must be halal certified")
    is_family_friendly: Optional[bool] = Field(None, description="Must be family friendly")

class SearchRequest(BaseModel):
    """
    Request body for search endpoint

    Example JSON:
    {
        "query": "romantic dinner spots with sunset views",
        "limit": 10,
        "filters": {
            "category": "restaurant",
            "min_price": 3
        },
        "user_id": "user_123"
    }
    """
    query: str = Field(..., min_length=1, description="Search query")
    limit: int = Field(default=10, ge=1, le=50, description="Maximum results to return")
    filters: Optional[SearchFilters] = Field(None, description="Optional search filters")
    user_id: str = Field(..., description="User ID from Clerk")

    class Config:
        json_schema_extra = {
            "example": {
                "query": "family-friendly activities near Burj Khalifa",
                "limit": 10,
                "filters": {
                    "is_family_friendly": True,
                    "max_price": 3
                },
                "user_id": "user_2abc123"
            }
        }

class SearchResult(BaseModel):
    """
    A single search result
    """
    id: str = Field(..., description="Location ID")
    name: str = Field(..., description="Location name")
    description: str = Field(..., description="Description")
    category: str = Field(..., description="Category")
    score: float = Field(..., ge=0, le=1, description="Relevance score (0-1)")
    tags: List[str] = Field(default=[], description="Tags/keywords")

class SearchResponse(BaseModel):
    """
    Response from search endpoint
    """
    success: bool = Field(..., description="Whether the request succeeded")
    results: Optional[List[SearchResult]] = Field(None, description="Search results")
    count: Optional[int] = Field(None, description="Number of results")
    error: Optional[str] = Field(None, description="Error message if failed")

# ============================================================================
# SAFETY CHECK MODELS
# ============================================================================

class Coordinates(BaseModel):
    """
    Geographic coordinates
    """
    lat: float = Field(..., ge=-90, le=90, description="Latitude (-90 to 90)")
    lng: float = Field(..., ge=-180, le=180, description="Longitude (-180 to 180)")

class SafetyCheckRequest(BaseModel):
    """
    Request body for safety check endpoint

    Example JSON:
    {
        "location_name": "Dubai Marina Walk",
        "coordinates": {"lat": 25.08, "lng": 55.14},
        "time_of_day": "evening",
        "user_id": "user_123"
    }
    """
    location_name: str = Field(..., min_length=1, description="Location name")
    coordinates: Coordinates = Field(..., description="Geographic coordinates")
    time_of_day: str = Field(..., description="Time of day: morning/afternoon/evening/night")
    user_id: str = Field(..., description="User ID from Clerk")

    class Config:
        json_schema_extra = {
            "example": {
                "location_name": "Jumeirah Beach",
                "coordinates": {"lat": 25.2048, "lng": 55.2708},
                "time_of_day": "night",
                "user_id": "user_2abc123"
            }
        }

class SafetyCheckResponse(BaseModel):
    """
    Response from safety check endpoint
    """
    success: bool = Field(..., description="Whether the request succeeded")
    risk_score: Optional[int] = Field(None, ge=0, le=100, description="Risk score (0-100)")
    risk_level: Optional[str] = Field(None, description="Risk level: low/medium/high/critical")
    analysis: Optional[str] = Field(None, description="AI's detailed analysis")
    recommendations: Optional[List[str]] = Field(None, description="Safety recommendations")
    location: Optional[str] = Field(None, description="Location name")
    time_of_day: Optional[str] = Field(None, description="Time of day analyzed")
    error: Optional[str] = Field(None, description="Error message if failed")

# ============================================================================
# GENERIC RESPONSE MODELS
# ============================================================================

class ErrorResponse(BaseModel):
    """
    Standard error response
    """
    success: bool = Field(default=False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")

class HealthResponse(BaseModel):
    """
    Health check response
    """
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
