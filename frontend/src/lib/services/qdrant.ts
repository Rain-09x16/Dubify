import { QdrantClient } from '@qdrant/js-client-rest';
import { geminiService } from './gemini';
import type { SearchRequest, SearchResponse, SearchResult, Location } from '@/lib/types';

const COLLECTION_NAME = 'dubai_locations';

// Initialize Qdrant client
let client: QdrantClient | null = null;

function getClient(): QdrantClient {
  if (!client) {
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    const apiKey = process.env.QDRANT_API_KEY;

    client = new QdrantClient({
      url,
      apiKey,
    });
  }
  return client;
}

/**
 * Initialize the Qdrant collection
 * Should be run once during setup
 */
export async function initializeCollection(): Promise<void> {
  try {
    const qdrant = getClient();

    // Check if collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

    if (exists) {
      console.log(`Collection '${COLLECTION_NAME}' already exists`);
      return;
    }

    // Create collection
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768, // text-embedding-004 dimension
        distance: 'Cosine',
      },
    });

    console.log(`Collection '${COLLECTION_NAME}' created successfully`);
  } catch (error) {
    console.error('Failed to initialize collection:', error);
    throw error;
  }
}

/**
 * Add a location to the vector database
 */
export async function addLocation(location: Location): Promise<void> {
  try {
    const qdrant = getClient();

    // Generate text for embedding
    const embeddingText = `${location.name} ${location.description} ${location.tags.join(' ')} ${location.category}`;

    // Generate embedding
    const { embedding } = await geminiService.generateEmbedding({
      text: embeddingText,
    });

    // Store in Qdrant
    await qdrant.upsert(COLLECTION_NAME, {
      points: [
        {
          id: location.id,
          vector: embedding,
          payload: {
            ...location,
          },
        },
      ],
    });

    console.log(`Location '${location.name}' added to vector database`);
  } catch (error) {
    console.error('Failed to add location:', error);
    throw error;
  }
}

/**
 * Bulk add locations to the vector database
 */
export async function bulkAddLocations(locations: Location[]): Promise<void> {
  try {
    const qdrant = getClient();

    // Generate embeddings for all locations
    const points = await Promise.all(
      locations.map(async (location, index) => {
        const embeddingText = `${location.name} ${location.description} ${location.tags.join(' ')} ${location.category}`;
        const { embedding } = await geminiService.generateEmbedding({
          text: embeddingText,
        });

        return {
          id: index + 1, // Qdrant requires integer IDs
          vector: embedding,
          payload: {
            ...location,
            originalId: location.id, // Store original ID in payload
          },
        };
      })
    );

    // Batch upsert
    await qdrant.upsert(COLLECTION_NAME, {
      points,
    });

    console.log(`${locations.length} locations added to vector database`);
  } catch (error) {
    console.error('Failed to bulk add locations:', error);
    throw error;
  }
}

/**
 * Search locations using semantic search
 */
export async function searchLocations(request: SearchRequest): Promise<SearchResponse> {
  const startTime = Date.now();

  try {
    const qdrant = getClient();

    // Generate embedding for query
    const { embedding } = await geminiService.generateEmbedding({
      text: request.query,
    });

    // Build filters
    const filter: any = { must: [] };

    if (request.filters?.category) {
      filter.must.push({
        key: 'category',
        match: { value: request.filters.category },
      });
    }

    if (request.filters?.halalCertified !== undefined) {
      filter.must.push({
        key: 'halalCertified',
        match: { value: request.filters.halalCertified },
      });
    }

    if (request.filters?.familyFriendly !== undefined) {
      filter.must.push({
        key: 'familyFriendly',
        match: { value: request.filters.familyFriendly },
      });
    }

    if (request.filters?.rating) {
      filter.must.push({
        key: 'rating',
        range: { gte: request.filters.rating },
      });
    }

    // Perform search
    const searchResults = await qdrant.search(COLLECTION_NAME, {
      vector: embedding,
      limit: request.limit || 10,
      filter: filter.must.length > 0 ? filter : undefined,
      with_payload: true,
    });

    // Map results to SearchResult type
    const results: SearchResult[] = searchResults.map((hit) => {
      const payload = hit.payload as any;

      // Calculate distance if user location is provided
      let distance: number | undefined;
      if (request.userLocation && payload.latitude && payload.longitude) {
        distance = calculateDistance(
          request.userLocation.lat,
          request.userLocation.lng,
          payload.latitude,
          payload.longitude
        );
      }

      return {
        id: hit.id.toString(),
        name: payload.name,
        description: payload.description,
        category: payload.category,
        tags: payload.tags || [],
        rating: payload.rating,
        reviewCount: payload.reviewCount || 0,
        priceRange: payload.priceRange,
        similarityScore: hit.score,
        distance,
        imageUrl: payload.imageUrl,
        latitude: payload.latitude,
        longitude: payload.longitude,
        verified: payload.verified || false,
        halalCertified: payload.halalCertified,
        familyFriendly: payload.familyFriendly,
        openingHours: payload.openingHours,
        address: payload.address,
      };
    });

    const queryTimeMs = Date.now() - startTime;

    return {
      results,
      total: results.length,
      queryTimeMs,
      suggestions: generateSearchSuggestions(request.query),
    };
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

/**
 * Get location by ID
 */
export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const qdrant = getClient();

    const result = await qdrant.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
    });

    if (result.length === 0) {
      return null;
    }

    return result[0].payload as unknown as Location;
  } catch (error) {
    console.error('Failed to get location:', error);
    return null;
  }
}

// Helper functions

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function generateSearchSuggestions(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes('romantic') || lowercaseQuery.includes('sunset')) {
    return [
      'romantic dinner with view',
      'sunset beach spots',
      'couples activities Dubai',
    ];
  }

  if (lowercaseQuery.includes('family') || lowercaseQuery.includes('kids')) {
    return [
      'family-friendly attractions',
      'water parks Dubai',
      'kid-friendly restaurants',
    ];
  }

  if (lowercaseQuery.includes('luxury') || lowercaseQuery.includes('expensive')) {
    return [
      'luxury shopping malls',
      'fine dining Dubai',
      '5-star experiences',
    ];
  }

  if (lowercaseQuery.includes('cheap') || lowercaseQuery.includes('budget')) {
    return [
      'budget-friendly activities',
      'affordable restaurants',
      'free attractions Dubai',
    ];
  }

  return [
    'traditional souks',
    'modern attractions',
    'beach activities',
  ];
}

export const qdrantService = {
  initializeCollection,
  addLocation,
  bulkAddLocations,
  searchLocations,
  getLocationById,
};
