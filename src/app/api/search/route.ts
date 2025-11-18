import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { qdrantService } from '@/lib/services/qdrant';
import { getAllLocations } from '@/lib/data/locations';
import { searchRateLimiter } from '@/lib/utils/rate-limit';
import type { SearchRequest, ApiResponse, SearchResponse, SearchResult } from '@/lib/types';

// For MVP, we'll use in-memory search with simple text matching
// In production, this would use the actual Qdrant vector database
async function performInMemorySearch(query: string, filters?: any): Promise<SearchResponse> {
  const startTime = Date.now();
  const locations = getAllLocations();

  // Simple text-based search for MVP demo
  const lowercaseQuery = query.toLowerCase();
  const results: SearchResult[] = locations
    .map((location) => {
      const searchText = `${location.name} ${location.description} ${location.tags.join(' ')} ${location.category}`.toLowerCase();

      // Calculate simple similarity score based on keyword matches
      const queryWords = lowercaseQuery.split(' ');
      let matchCount = 0;
      queryWords.forEach((word) => {
        if (searchText.includes(word)) matchCount++;
      });

      const similarityScore = matchCount / queryWords.length;

      return {
        id: location.id,
        name: location.name,
        description: location.description,
        category: location.category,
        tags: location.tags,
        rating: location.rating,
        reviewCount: location.reviewCount,
        priceRange: location.priceRange,
        similarityScore,
        imageUrl: location.imageUrl,
        latitude: location.latitude,
        longitude: location.longitude,
        verified: location.verified,
        halalCertified: location.halalCertified,
        familyFriendly: location.familyFriendly,
        openingHours: location.openingHours?.monday || undefined,
        address: location.address,
      };
    })
    .filter((result) => {
      // Filter by similarity
      if (result.similarityScore === 0) return false;

      // Apply filters if provided
      if (filters?.category && result.category !== filters.category) return false;
      if (filters?.halalCertified !== undefined && result.halalCertified !== filters.halalCertified)
        return false;
      if (filters?.familyFriendly !== undefined && result.familyFriendly !== filters.familyFriendly)
        return false;
      if (filters?.rating && result.rating < filters.rating) return false;

      return true;
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 10);

  const queryTimeMs = Date.now() - startTime;

  return {
    results,
    total: results.length,
    queryTimeMs,
    suggestions: generateSuggestions(query),
  };
}

function generateSuggestions(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();

  if (lowercaseQuery.includes('romantic')) {
    return ['romantic dinner spots', 'sunset viewing points', 'couples activities'];
  }
  if (lowercaseQuery.includes('family')) {
    return ['family restaurants', 'kid-friendly attractions', 'water parks'];
  }
  if (lowercaseQuery.includes('luxury')) {
    return ['luxury hotels', 'fine dining', 'high-end shopping'];
  }
  if (lowercaseQuery.includes('traditional')) {
    return ['traditional souks', 'cultural museums', 'heritage sites'];
  }

  return ['top attractions', 'best restaurants', 'hidden gems'];
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to use the search feature',
          },
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimit = searchRateLimiter.check(userId);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. You can make 30 searches per hour. Try again at ${resetDate.toLocaleTimeString()}.`,
          },
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body: SearchRequest = await request.json();

    // Validate request
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Query is required and must be a string',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Perform search
    // For MVP, using in-memory search
    // In production, uncomment the line below to use Qdrant
    // const searchResponse = await qdrantService.searchLocations(body);

    const searchResponse = await performInMemorySearch(body.query, body.filters);

    return NextResponse.json(
      {
        success: true,
        data: searchResponse,
        timestamp: new Date(),
      } as ApiResponse<SearchResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to process search request',
        },
        timestamp: new Date(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        endpoint: '/api/search',
        method: 'POST',
        description: 'Semantic search for Dubai locations using natural language',
        vectorDB: 'Qdrant',
        embeddings: 'text-embedding-004',
        example: {
          query: 'romantic sunset spots',
          filters: {
            category: 'restaurant',
            halalCertified: true,
          },
          limit: 10,
        },
      },
      timestamp: new Date(),
    } as ApiResponse,
    { status: 200 }
  );
}
