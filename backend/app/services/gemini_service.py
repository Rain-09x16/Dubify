"""
Gemini AI Service
Handles all interactions with Google's Gemini AI

This service is like a "translator" between our app and Google's AI.
It sends requests to Gemini and processes the responses.
"""

import google.generativeai as genai
from app.config import settings
from typing import List, Dict, Optional

class GeminiService:
    """
    Gemini AI Service Class

    A class is like a blueprint for creating objects.
    This class contains all the methods (functions) we need
    to interact with the Gemini AI.
    """

    def __init__(self):
        """
        Constructor - Runs when we create a new GeminiService object

        This sets up the connection to Gemini AI using our API key.
        """
        # Configure the Gemini API with our key from environment variables
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # Create a model instance - this is what we'll use to generate responses
        # gemini-2.0-flash-exp is the latest, fastest Gemini model
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

        # System prompt for Dubai tourism chatbot
        # This "teaches" the AI how to behave
        self.tourism_system_prompt = """You are a knowledgeable Dubai tourism assistant.
You help tourists discover Dubai's attractions, culture, and experiences.

Guidelines:
- Keep responses concise (2-5 sentences)
- Be culturally aware (respect for Ramadan, prayer times, dress codes)
- Prioritize safety in all recommendations
- Use markdown formatting for better readability
- Be friendly and helpful

Focus on: attractions, restaurants, culture, safety, transportation, best times to visit."""

    async def chat(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Send a chat message to Gemini and get a response

        Args:
            message: The user's question/message
            history: Previous conversation history (optional)

        Returns:
            AI's response as a string

        How it works:
        1. Takes user's message
        2. Adds system prompt to guide AI behavior
        3. Sends to Gemini AI
        4. Returns AI's response
        """
        try:
            # Add the system prompt and current message
            full_prompt = f"{self.tourism_system_prompt}\n\nUser: {message}"

            # Send to Gemini and get response
            # generate_content() is the main method that talks to the AI
            response = self.model.generate_content(full_prompt)

            # Extract and return the text response
            return response.text

        except Exception as e:
            # If something goes wrong, return an error message
            # In production, you'd log this error
            print(f"Gemini chat error: {str(e)}")
            return f"I apologize, but I encountered an error: {str(e)}"

    async def safety_check(
        self,
        location_name: str,
        coordinates: Dict[str, float],
        time_of_day: str
    ) -> Dict:
        """
        Perform AI-powered safety assessment for a location

        Args:
            location_name: Name of the location (e.g., "Dubai Marina")
            coordinates: Dictionary with 'lat' and 'lng' keys
            time_of_day: Time of day (morning/afternoon/evening/night)

        Returns:
            Dictionary with risk score, level, and recommendations

        How it works:
        1. Creates a detailed prompt asking AI to analyze safety
        2. Sends to Gemini AI
        3. Parses AI's response
        4. Returns structured data
        """
        try:
            # Create a detailed prompt for safety analysis
            safety_prompt = f"""Analyze the safety of this Dubai location:

Location: {location_name}
Coordinates: {coordinates.get('lat')}, {coordinates.get('lng')}
Time of Day: {time_of_day}

Provide a safety assessment with:
1. Overall risk score (0-100, where 0 is safest)
2. Risk level (low/medium/high/critical)
3. Specific safety recommendations
4. Time-sensitive concerns

Consider factors like:
- Tourist safety in Dubai
- Time of day risks
- General area safety
- Cultural considerations
- Emergency services availability"""

            # Get AI analysis
            response = self.model.generate_content(safety_prompt)
            analysis = response.text

            # Parse the AI response and create structured data
            # These helper methods extract information from the text
            risk_score = self._estimate_risk_score(analysis)
            risk_level = self._get_risk_level(risk_score)

            return {
                "risk_score": risk_score,
                "risk_level": risk_level,
                "analysis": analysis,
                "recommendations": self._extract_recommendations(analysis),
                "location": location_name,
                "time_of_day": time_of_day
            }

        except Exception as e:
            print(f"Gemini safety check error: {str(e)}")
            # Return a safe default response if there's an error
            return {
                "risk_score": 50,
                "risk_level": "medium",
                "analysis": f"Error performing safety analysis: {str(e)}",
                "recommendations": ["Unable to assess safety at this time"],
                "location": location_name,
                "time_of_day": time_of_day
            }

    def _estimate_risk_score(self, analysis: str) -> int:
        """
        Estimate risk score from AI analysis text

        This is a simple keyword-based estimation.
        In production, you'd use more sophisticated NLP.

        Args:
            analysis: The AI's text analysis

        Returns:
            Risk score from 0-100
        """
        analysis_lower = analysis.lower()

        # Keywords that indicate safety
        safe_keywords = ['safe', 'low risk', 'secure', 'protected', 'tourist-friendly']
        # Keywords that indicate danger
        danger_keywords = ['danger', 'high risk', 'avoid', 'caution', 'unsafe', 'critical']

        # Count how many times each type of keyword appears
        safe_count = sum(1 for keyword in safe_keywords if keyword in analysis_lower)
        danger_count = sum(1 for keyword in danger_keywords if keyword in analysis_lower)

        # Calculate score (0-100)
        # More danger keywords = higher score (more dangerous)
        # More safe keywords = lower score (safer)
        if danger_count > safe_count:
            return min(70 + (danger_count * 10), 95)
        elif safe_count > danger_count:
            return max(20 - (safe_count * 5), 5)
        else:
            return 40  # Neutral

    def _get_risk_level(self, score: int) -> str:
        """
        Convert numeric risk score to text level

        Makes it easier for humans to understand:
        - 0-29 = "low"
        - 30-59 = "medium"
        - 60-79 = "high"
        - 80-100 = "critical"
        """
        if score < 30:
            return "low"
        elif score < 60:
            return "medium"
        elif score < 80:
            return "high"
        else:
            return "critical"

    def _extract_recommendations(self, analysis: str) -> List[str]:
        """
        Extract recommendations from AI analysis

        Looks for sentences that contain recommendation keywords
        and returns them as a list.
        """
        # Split the analysis into individual lines
        lines = analysis.split('\n')
        recommendations = []

        for line in lines:
            line = line.strip()
            # Look for lines that seem like recommendations
            # These usually contain words like "should", "recommend", etc.
            if any(word in line.lower() for word in ['should', 'recommend', 'consider', 'avoid', 'ensure']):
                # Clean up the line and add it
                if line:
                    recommendations.append(line)

        # If we didn't find any, return defaults
        if not recommendations:
            recommendations = [
                "Stay aware of your surroundings",
                "Follow local customs and laws"
            ]

        # Return maximum 5 recommendations
        return recommendations[:5]

# Create a single instance to be used throughout the app
# This is called a "singleton" pattern - one object shared everywhere
gemini_service = GeminiService()
