"""
Safety Check API Endpoint
Handles AI-powered safety assessments

This file defines the /api/safety endpoint.
It uses AI to analyze the safety of a location.
"""

from fastapi import APIRouter, HTTPException, status
from app.models.schemas import SafetyCheckRequest, SafetyCheckResponse
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/safety", response_model=SafetyCheckResponse)
async def safety_check(request: SafetyCheckRequest):
    """
    AI-Powered Safety Assessment

    This endpoint:
    1. Takes a location name, coordinates, and time of day
    2. Sends them to Gemini AI for analysis
    3. AI considers factors like tourist safety, time of day, area reputation
    4. Returns a risk score and recommendations

    Args:
        request: SafetyCheckRequest with location details

    Returns:
        SafetyCheckResponse with safety assessment

    Example:
        POST /api/safety
        {
            "location_name": "Dubai Marina Walk",
            "coordinates": {"lat": 25.08, "lng": 55.14},
            "time_of_day": "night",
            "user_id": "user_123"
        }

        Response:
        {
            "success": true,
            "risk_score": 15,
            "risk_level": "low",
            "analysis": "Dubai Marina is generally very safe at night...",
            "recommendations": [
                "Stay in well-lit areas",
                "Keep valuables secure"
            ],
            "location": "Dubai Marina Walk",
            "time_of_day": "night"
        }
    """
    try:
        # Extract request data
        location_name = request.location_name
        coordinates = request.coordinates.dict()  # Convert to dictionary
        time_of_day = request.time_of_day

        # Perform AI safety analysis
        # This sends everything to Gemini AI which analyzes the safety
        safety_result = await gemini_service.safety_check(
            location_name=location_name,
            coordinates=coordinates,
            time_of_day=time_of_day
        )

        # Return successful response with AI's assessment
        return SafetyCheckResponse(
            success=True,
            risk_score=safety_result.get('risk_score'),
            risk_level=safety_result.get('risk_level'),
            analysis=safety_result.get('analysis'),
            recommendations=safety_result.get('recommendations'),
            location=safety_result.get('location'),
            time_of_day=safety_result.get('time_of_day')
        )

    except Exception as e:
        print(f"Safety check endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing safety check: {str(e)}"
        )
