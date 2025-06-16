
import DOMPurify from 'dompurify';

// Input sanitization utilities
export const sanitizeMessage = (message: string): string => {
  // Remove any HTML tags and sanitize the content
  const sanitized = DOMPurify.sanitize(message, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Limit message length
  return sanitized.slice(0, 4000);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMessageLength = (message: string): boolean => {
  return message.trim().length > 0 && message.trim().length <= 4000;
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    
    const remaining = record.resetTime - Date.now();
    return Math.max(0, remaining);
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Create rate limiters for different operations
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const messageRateLimiter = new RateLimiter(50, 60 * 1000); // 50 messages per minute
