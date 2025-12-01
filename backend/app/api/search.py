"""
Search API Endpoint
Handles semantic search requests

This file defines the /api/search endpoint.
It performs "smart" searches that understand meaning, not just keywords.
"""

from fastapi import APIRouter, HTTPException, status
from app.models.schemas import SearchRequest, SearchResponse, SearchResult
from app.services.qdrant_service import qdrant_service

router = APIRouter()

@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    Semantic Search for Locations

    This endpoint:
    1. Takes a search query (e.g., "romantic dinner spots")
    2. Converts it to a vector (list of numbers representing meaning)
    3. Finds locations with similar vectors
    4. Returns the most relevant results

    The magic: You can search for "family activities" and get results
    for "kids playground" even though the words are different!

    Args:
        request: SearchRequest with query and optional filters

    Returns:
        SearchResponse with matching locations

    Example:
        POST /api/search
        {
            "query": "romantic sunset views",
            "limit": 5,
            "filters": {"category": "restaurant"},
            "user_id": "user_123"
        }

        Response:
        {
            "success": true,
            "results": [
                {
                    "id": "loc_1",
                    "name": "Pierchic Restaurant",
                    "description": "Overwater dining with stunning sunset views",
                    "score": 0.92
                }
            ],
            "count": 5
        }
    """
    try:
        # Extract search parameters
        query = request.query
        limit = request.limit
        filters = request.filters

        # Perform semantic search using Qdrant service
        # This is where the "magic" happens - it finds similar meanings
        search_results = await qdrant_service.search(
            query=query,
            limit=limit,
            filters=filters.dict() if filters else None
        )

        # Convert raw results to SearchResult objects
        formatted_results = []
        for result in search_results:
            payload = result.get('payload', {})
            formatted_results.append(
                SearchResult(
                    id=result.get('id', ''),
                    name=payload.get('name', 'Unknown'),
                    description=payload.get('description', ''),
                    category=payload.get('category', 'other'),
                    score=result.get('score', 0.0),
                    tags=payload.get('tags', [])
                )
            )

        # Return successful response
        return SearchResponse(
            success=True,
            results=formatted_results,
            count=len(formatted_results)
        )

    except Exception as e:
        print(f"Search endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing search: {str(e)}"
        )
