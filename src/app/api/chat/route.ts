import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { geminiService } from '@/lib/services/gemini';
import { chatRateLimiter } from '@/lib/utils/rate-limit';
import type { ChatRequest, ApiResponse, ChatResponse } from '@/lib/types';

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
            message: 'You must be signed in to use the chat feature',
          },
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimit = chatRateLimiter.check(userId);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. You can make 20 chat requests per hour. Try again at ${resetDate.toLocaleTimeString()}.`,
          },
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body: ChatRequest = await request.json();

    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Message is required and must be a string',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Generate chat response using Gemini
    const chatResponse: ChatResponse = await geminiService.generateChatResponse(body);

    return NextResponse.json(
      {
        success: true,
        data: chatResponse,
        timestamp: new Date(),
      } as ApiResponse<ChatResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to process chat request',
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
        endpoint: '/api/chat',
        method: 'POST',
        description: 'AI-powered chat assistant for Dubai tourism questions',
        model: 'gemini-2.0-flash-exp',
        example: {
          message: 'What are the best places to visit in Dubai?',
          conversationId: 'optional-conversation-id',
        },
      },
      timestamp: new Date(),
    } as ApiResponse,
    { status: 200 }
  );
}
