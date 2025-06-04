const express = require('express');
const {
  createCustomUrl,
  createShortUrl,
  deleteUrl,
  getUrlByAnonId,
} = require('../Controllers/url.controller.js');
const { authMiddleware } = require('../Middlewares/auth.middleware.js');
const { optionalAuth } = require('../Middlewares/optionalAuth.middleware.js');
const {
  validateCustomUrl,
  validateURL,
} = require('../Middlewares/validate.middleware.js');
const {
  createUrlLimiter,
} = require('../Middlewares/rateLimiter.middleware.js');

const router = express.Router();

router.post(
  '/create',
  createUrlLimiter,
  validateURL,
  optionalAuth,
  createShortUrl
);
router.post(
  '/create/customUrl',
  createUrlLimiter,
  validateCustomUrl,
  authMiddleware,
  createCustomUrl
);
router.get('/url/:anonId', getUrlByAnonId);

router.delete('/delete/:id', deleteUrl);

module.exports = router;
