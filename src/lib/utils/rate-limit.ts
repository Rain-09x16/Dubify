// Simple in-memory rate limiter
// For production, use Redis or a database

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 20, windowMinutes: number = 60) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  check(userId: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(userId);

    // No entry or expired window - create new
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.limits.set(userId, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    // Within window - check limit
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.limits.set(userId, entry);
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  private cleanup() {
    const now = Date.now();
    for (const [userId, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(userId);
      }
    }
  }

  reset(userId: string) {
    this.limits.delete(userId);
  }
}

// Create rate limiters for different features
export const chatRateLimiter = new RateLimiter(20, 60); // 20 requests per hour
export const searchRateLimiter = new RateLimiter(30, 60); // 30 requests per hour
export const safetyRateLimiter = new RateLimiter(10, 60); // 10 requests per hour
