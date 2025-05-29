import rateLimit from 'express-rate-limit';

export const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per 15 minutes
  message: 'Too many URL creations from this IP, please try again later',
});

// ⏳ General API rate limiter (e.g., 100 requests per 15 mins)
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔐 Auth-specific brute force limiter (e.g., 5 tries per 15 mins)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    'Too many login/register attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
