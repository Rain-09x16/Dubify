import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatRequest, ChatResponse, EmbeddingRequest, EmbeddingResponse } from '@/lib/types';

// Lazy initialize Gemini AI to ensure env vars are loaded
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || 'demo_key';
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// System prompt for Dubai tourism context
const DUBAI_SYSTEM_PROMPT = `You are Dubai Navigator AI, a helpful and knowledgeable tourism assistant for Dubai.

ROLE: Expert Dubai guide with deep cultural knowledge and practical travel advice

PERSONALITY:
- Friendly and welcoming
- Concise (2-5 sentences per response)
- Culturally sensitive and respectful
- Safety-conscious
- Honest about limitations

IMPORTANT RULES:
1. Always consider local customs:
   - Modest dress code in public (shoulders and knees covered)
   - Respect during Ramadan (no eating/drinking in public during daylight)
   - Prayer times (some venues may close briefly)
   - Friday is a holy day (some businesses closed morning)

2. Prioritize safety:
   - Mention safe areas and times
   - Warn about extreme heat (40°C+ in summer)
   - Advise on hydration and sun protection
   - Provide emergency contact info when relevant

3. Be specific:
   - Cite actual locations and landmarks
   - Provide realistic time estimates
   - Mention transportation options
   - Include price ranges when relevant

4. Cultural awareness:
   - Respect Islamic customs
   - Acknowledge Dubai's multicultural environment
   - Mention halal food options
   - Explain local etiquette when relevant

5. If unsure, admit limitations and suggest alternatives

RESPONSE FORMAT:
- Keep responses concise (2-5 sentences)
- Use bullet points for lists
- Include specific location names
- End with a helpful suggestion when appropriate`;

/**
 * Generate chat response using Gemini
 */
export async function generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
  const startTime = Date.now();

  try {
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: DUBAI_SYSTEM_PROMPT,
    });

    // Build conversation context
    const context = request.userContext
      ? `\n\nUser Context: ${JSON.stringify(request.userContext, null, 2)}`
      : '';

    const prompt = `${request.message}${context}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const processingTimeMs = Date.now() - startTime;

    return {
      response,
      conversationId: request.conversationId || generateConversationId(),
      suggestions: generateSuggestions(request.message),
      metadata: {
        model: 'gemini-2.5-flash',
        tokensUsed: estimateTokens(prompt + response),
        processingTimeMs,
      },
    };
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error('Failed to generate chat response');
  }
}

/**
 * Generate text embedding using Gemini
 */
export async function generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
  try {
    const model = 'text-embedding-004';
    const result = await getGenAI().getGenerativeModel({ model }).embedContent(request.text);

    return {
      embedding: result.embedding.values,
      model,
      dimensions: result.embedding.values.length,
    };
  } catch (error) {
    console.error('Gemini embedding error:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Analyze image using Gemini Vision
 */
export async function analyzeImage(imageBase64: string, prompt: string): Promise<string> {
  try {
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Gemini vision error:', error);
    throw new Error('Failed to analyze image');
  }
}

/**
 * Generate safety assessment using Gemini
 */
export async function generateSafetyAssessment(
  location: { latitude: number; longitude: number; areaName?: string },
  context?: { timeOfDay?: string; weather?: string; incidents?: string[] }
): Promise<{
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
}> {
  try {
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const prompt = `Analyze safety for a tourist at this location in Dubai:

Location: ${location.areaName || 'Unknown area'} (${location.latitude}, ${location.longitude})
Time: ${context?.timeOfDay || 'Current time'}
Weather: ${context?.weather || 'Normal conditions'}
Recent incidents: ${context?.incidents?.join(', ') || 'None reported'}

Assess the risk level (0-100) considering:
- Area type (tourist zone, residential, industrial, desert)
- Time of day (daylight is generally safer)
- Recent safety incidents
- Weather conditions (extreme heat, sandstorms)
- Foot traffic levels
- Proximity to tourist areas

Provide a JSON response with this exact structure:
{
  "risk_score": number (0-100),
  "risk_level": "low" | "medium" | "high" | "critical",
  "message": "Brief safety assessment in 1-2 sentences",
  "recommendations": ["Specific safety tip 1", "Specific safety tip 2", "Specific safety tip 3"]
}

Dubai is generally very safe for tourists. Most areas score below 30. Only remote desert areas or industrial zones should score above 50.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const assessment = JSON.parse(jsonMatch[0]);

    return {
      riskScore: assessment.risk_score,
      riskLevel: assessment.risk_level,
      message: assessment.message,
      recommendations: assessment.recommendations,
    };
  } catch (error) {
    console.error('Gemini safety assessment error:', error);

    // Fallback to default safe response
    return {
      riskScore: 20,
      riskLevel: 'low',
      message: 'Dubai is generally very safe for tourists. Stay aware of your surroundings.',
      recommendations: [
        'Stay hydrated in hot weather',
        'Keep valuables secure',
        'Use licensed taxis or ride-sharing apps',
        'Emergency number in UAE: 999',
      ],
    };
  }
}

// Helper functions

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSuggestions(message: string): string[] {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes('food') || lowercaseMsg.includes('restaurant')) {
    return [
      'Where can I find authentic Emirati food?',
      'Best restaurants with a view?',
      'Halal dining options near me',
    ];
  }

  if (lowercaseMsg.includes('visit') || lowercaseMsg.includes('see')) {
    return [
      'Must-see attractions in Dubai',
      'Best time to visit Burj Khalifa?',
      'Family-friendly activities',
    ];
  }

  if (lowercaseMsg.includes('safe') || lowercaseMsg.includes('safety')) {
    return [
      'Is it safe to walk at night?',
      'What are the emergency numbers?',
      'Safety tips for solo travelers',
    ];
  }

  return [
    'What should I know about local customs?',
    'Best areas to stay in Dubai?',
    'How to get around Dubai?',
  ];
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export const geminiService = {
  generateChatResponse,
  generateEmbedding,
  analyzeImage,
  generateSafetyAssessment,
};
