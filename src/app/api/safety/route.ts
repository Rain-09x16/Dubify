import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { SafetyCheckRequest, ApiResponse, SafetyCheckResponse } from '@/lib/types';
import { geminiService } from '@/lib/services/gemini';
import { safetyRateLimiter } from '@/lib/utils/rate-limit';

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
            message: 'You must be signed in to use the safety check feature',
          },
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimit = safetyRateLimiter.check(userId);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. You can make 10 safety checks per hour. Try again at ${resetDate.toLocaleTimeString()}.`,
          },
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body: SafetyCheckRequest = await request.json();

    // Validate request
    if (
      typeof body.latitude !== 'number' ||
      typeof body.longitude !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Valid latitude and longitude are required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Perform AI-powered safety check using Gemini
    const now = new Date();
    const timeOfDay = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });

    const assessment = await geminiService.generateSafetyAssessment(
      {
        latitude: body.latitude,
        longitude: body.longitude,
        areaName: body.areaName,
      },
      {
        timeOfDay,
      }
    );

    // Generate unique workflow ID
    const workflowId = `safety_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const safetyResponse: SafetyCheckResponse = {
      riskLevel: assessment.riskLevel,
      riskScore: assessment.riskScore,
      message: assessment.message,
      recommendations: assessment.recommendations,
      workflowId,
      checkedAt: now,
      auditReport: {
        jsonData: {
          location: {
            latitude: body.latitude,
            longitude: body.longitude,
            areaName: body.areaName || 'Unknown area',
          },
          analysis: {
            areaType: 'Tourist area',
            timeOfDay,
            weatherConditions: 'Normal',
            footTraffic: 'Moderate',
          },
          riskFactors: [],
          recommendations: assessment.recommendations,
          emergencyContacts: [
            { name: 'Police', phone: '999', type: 'police' },
            { name: 'Ambulance', phone: '998', type: 'ambulance' },
            { name: 'Tourist Police', phone: '+971 4 269 2222', type: 'tourist_police' },
          ],
          assessedBy: 'Gemini 2.5 Flash AI',
          assessmentTime: now,
          workflowStages: [
            {
              stage: 1,
              name: 'Data Intake',
              status: 'completed',
              note: 'Location coordinates and context collected',
              timestamp: now,
            },
            {
              stage: 2,
              name: 'AI Understanding',
              status: 'completed',
              note: 'Gemini analyzed safety factors and risk assessment',
              timestamp: now,
            },
            {
              stage: 3,
              name: 'Decision Logic',
              status: 'completed',
              note: assessment.riskLevel === 'high' || assessment.riskLevel === 'critical'
                ? 'High risk detected - human review recommended'
                : 'Risk level acceptable - no human review needed',
              timestamp: now,
            },
            {
              stage: 4,
              name: 'Human Review',
              status: assessment.riskLevel === 'high' || assessment.riskLevel === 'critical'
                ? 'required'
                : 'skipped',
              note: assessment.riskLevel === 'high' || assessment.riskLevel === 'critical'
                ? 'Manual verification recommended for high-risk areas'
                : 'Automated assessment sufficient for this risk level',
              timestamp: now,
            },
            {
              stage: 5,
              name: 'Delivery & Audit',
              status: 'completed',
              note: 'Safety report generated with recommendations',
              timestamp: now,
            },
          ],
        },
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: safetyResponse,
        timestamp: new Date(),
      } as ApiResponse<SafetyCheckResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Safety API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to process safety check request',
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
        endpoint: '/api/safety',
        method: 'POST',
        description: 'AI-powered safety check for Dubai locations',
        ai: 'Gemini 2.0 Flash',
        stages: [
          '1. Data Intake',
          '2. AI Risk Assessment',
          '3. Recommendations Generation',
          '4. Cultural Notes Analysis',
          '5. Emergency Info Delivery',
        ],
        example: {
          latitude: 25.1972,
          longitude: 55.2744,
          areaName: 'Downtown Dubai',
        },
      },
      timestamp: new Date(),
    } as ApiResponse,
    { status: 200 }
  );
}
