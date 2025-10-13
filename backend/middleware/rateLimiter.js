const rateLimit = require("express-rate-limit");

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: {
    success: false,
    message: "Too many password reset attempts, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: "Too many registration attempts, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Product browsing rate limiter
const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 product requests per minute
  message: {
    success: false,
    message: "Too many product requests, please try again in a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  registrationLimiter,
  productLimiter,
};
