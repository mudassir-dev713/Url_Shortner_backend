const rateLimit = require('express-rate-limit');

const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per 15 minutes
  message: 'Too many URL creations from this IP, please try again later',
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/register attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createUrlLimiter,
  generalApiLimiter,
  authLimiter,
};
