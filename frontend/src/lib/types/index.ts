// Dubai Navigator AI - Type Definitions

// ========== Chat Types ==========
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userContext?: UserContext;
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  suggestions?: string[];
  metadata: {
    model: string;
    tokensUsed?: number;
    processingTimeMs: number;
  };
}

export interface UserContext {
  location?: {
    latitude: number;
    longitude: number;
  };
  preferences?: string[];
  travelDates?: {
    start: Date;
    end: Date;
  };
}

// ========== Search Types ==========
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

export interface SearchFilters {
  category?: string;
  priceRange?: string;
  rating?: number;
  halalCertified?: boolean;
  familyFriendly?: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  similarityScore: number;
  distance?: number;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  halalCertified?: boolean;
  familyFriendly?: boolean;
  openingHours?: string;
  address?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  queryTimeMs: number;
  suggestions?: string[];
}

// ========== Location Types ==========
export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  tags: string[];
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  imageUrl?: string;
  images?: string[];
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: OpeningHours;
  verified: boolean;
  halalCertified?: boolean;
  familyFriendly?: boolean;
  safetyScore?: number;
  accessibility?: string[];
  amenities?: string[];
  popularTimes?: PopularTimes;
}

export type LocationCategory =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'shopping'
  | 'entertainment'
  | 'beach'
  | 'park'
  | 'museum'
  | 'mosque'
  | 'market'
  | 'adventure';

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface PopularTimes {
  [hour: string]: number; // 0-100 representing busyness
}

// ========== Safety Types ==========
export interface SafetyCheckRequest {
  latitude: number;
  longitude: number;
  areaName?: string;
  checkTime?: Date;
}

export interface SafetyCheckResponse {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
  workflowId: string;
  auditReport: {
    pdfUrl?: string;
    jsonData: SafetyAuditData;
  };
  checkedAt: Date;
}

export interface SafetyAuditData {
  location: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
  analysis: {
    areaType: string;
    timeOfDay: string;
    weatherConditions: string;
    footTraffic: string;
  };
  riskFactors: Array<{
    factor: string;
    severity: string;
    description: string;
  }>;
  recommendations: string[];
  emergencyContacts: EmergencyContact[];
  assessedBy: string;
  assessmentTime: Date;
  workflowStages?: Array<{
    stage: number;
    name: string;
    status: string;
    note?: string;
    timestamp: Date;
  }>;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  type: 'police' | 'ambulance' | 'fire' | 'tourist_police' | 'embassy';
}

// ========== Expense Types ==========
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  merchant: string;
  date: Date;
  notes?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export type ExpenseCategory =
  | 'dining'
  | 'transport'
  | 'accommodation'
  | 'shopping'
  | 'activities'
  | 'other';

// ========== Itinerary Types ==========
export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  days: ItineraryDay[];
  budget?: number;
  groupSize?: number;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryDay {
  date: Date;
  activities: Activity[];
}

export interface Activity {
  id: string;
  locationId: string;
  name: string;
  type: 'attraction' | 'dining' | 'transport' | 'rest';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  notes?: string;
}

// ========== User Types ==========
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  interests?: string[];
  dietaryRestrictions?: string[];
  budgetLevel?: 'budget' | 'moderate' | 'luxury';
  travelStyle?: 'relaxed' | 'moderate' | 'packed';
  language?: string;
  currency?: string;
}

// ========== API Response Types ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// ========== Workflow Types ==========
export interface WorkflowTriggerRequest {
  workflowId: string;
  inputs: Record<string, any>;
}

export interface WorkflowTriggerResponse {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputs?: Record<string, any>;
  error?: string;
}

// ========== Vector Embedding Types ==========
export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  dimensions: number;
}

// ========== Cultural Guide Types ==========
export interface CulturalTip {
  id: string;
  category: 'dress' | 'etiquette' | 'religion' | 'customs' | 'safety';
  title: string;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
}

// ========== Prayer Times Types ==========
export interface PrayerTimes {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer?: string;
  timeUntilNext?: string;
}
