"""
Qdrant Vector Database Service
Handles semantic search using vector embeddings

Vector databases store data as numbers (vectors) instead of text.
This allows us to search by "meaning" rather than exact keywords.

Example: Searching for "romantic spots" will find "sunset beach" even though
the words are different, because they have similar meanings.
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict, Optional
import google.generativeai as genai
from app.config import settings

class QdrantService:
    """
    Qdrant Service for Semantic Search

    This service:
    1. Converts text to vectors (numbers) using Gemini
    2. Stores vectors in Qdrant database
    3. Searches for similar vectors (similar meanings)
    """

    def __init__(self):
        """
        Initialize Qdrant client and Gemini for embeddings

        Embeddings = Converting text into numbers that represent meaning
        """
        # Check if Qdrant credentials are provided
        if settings.QDRANT_URL and settings.QDRANT_API_KEY:
            # Connect to Qdrant Cloud
            self.client = QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY
            )
            self.use_qdrant = True
        else:
            # Use in-memory mode (for development/testing)
            self.client = None
            self.use_qdrant = False

        # Configure Gemini for creating embeddings
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # Collection name in Qdrant (like a "table" in traditional databases)
        self.collection_name = "dubai_locations"

    async def create_embedding(self, text: str) -> List[float]:
        """
        Convert text to a vector (list of numbers)

        How it works:
        1. Send text to Gemini
        2. Gemini analyzes the meaning
        3. Returns a list of 768 numbers representing the meaning

        Args:
            text: The text to convert (e.g., "romantic sunset spots")

        Returns:
            List of 768 numbers (the vector/embedding)
        """
        try:
            # Use Gemini's embedding model
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']

        except Exception as e:
            print(f"Embedding error: {str(e)}")
            # Return a zero vector if there's an error
            return [0.0] * 768

    async def search(
        self,
        query: str,
        limit: int = 10,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for locations using semantic search

        Args:
            query: What the user is looking for (e.g., "family-friendly activities")
            limit: Maximum number of results to return
            filters: Optional filters (category, price, etc.)

        Returns:
            List of matching locations with similarity scores

        How it works:
        1. Convert user's query to a vector
        2. Find locations with similar vectors
        3. Return the most similar ones
        """
        if not self.use_qdrant:
            # Fallback to simple in-memory search
            return await self._in_memory_search(query, limit, filters)

        try:
            # Step 1: Convert query to vector
            query_vector = await self.create_embedding(query)

            # Step 2: Search in Qdrant
            # This finds vectors (locations) that are mathematically similar
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit
            )

            # Step 3: Format and return results
            results = []
            for hit in search_result:
                results.append({
                    "id": hit.id,
                    "score": hit.score,  # How similar (0-1, higher = more similar)
                    "payload": hit.payload  # The actual location data
                })

            return results

        except Exception as e:
            print(f"Qdrant search error: {str(e)}")
            # Fallback to in-memory search if Qdrant fails
            return await self._in_memory_search(query, limit, filters)

    async def _in_memory_search(
        self,
        query: str,
        limit: int,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Simple in-memory search (fallback when Qdrant is not available)

        This is a basic text-matching search, not semantic.
        It looks for exact keyword matches rather than meaning.
        """
        # This would normally load from a database or file
        # For now, return empty results
        # You can add sample data here for testing
        sample_locations = []

        # Simple keyword matching
        query_lower = query.lower()
        results = []

        for location in sample_locations:
            # Check if any query words appear in the location
            location_text = f"{location.get('name', '')} {location.get('description', '')}".lower()

            if any(word in location_text for word in query_lower.split()):
                results.append({
                    "id": location.get('id'),
                    "score": 0.8,  # Fake score for fallback
                    "payload": location
                })

        return results[:limit]

    async def add_location(self, location_id: str, location_data: Dict) -> bool:
        """
        Add a location to the vector database

        Args:
            location_id: Unique ID for the location
            location_data: Dictionary with location details

        Returns:
            True if successful, False otherwise

        How it works:
        1. Create text description of location
        2. Convert to vector
        3. Store in Qdrant with metadata
        """
        if not self.use_qdrant:
            return False

        try:
            # Combine location data into searchable text
            searchable_text = f"{location_data.get('name', '')} {location_data.get('description', '')} {' '.join(location_data.get('tags', []))}"

            # Create vector from text
            vector = await self.create_embedding(searchable_text)

            # Create a point (entry) in Qdrant
            point = PointStruct(
                id=location_id,
                vector=vector,
                payload=location_data  # Store all the location details
            )

            # Upload to Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            return True

        except Exception as e:
            print(f"Error adding location: {str(e)}")
            return False

# Create singleton instance
qdrant_service = QdrantService()
