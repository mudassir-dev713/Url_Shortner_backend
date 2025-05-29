import { Router } from 'express';
import {
  createCustomUrl,
  createShortUrl,
  deleteUrl,
} from '../Controllers/url.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { optionalAuth } from '../Middlewares/optionalAuth.middleware.js';
import {
  validateCustomUrl,
  validateURL,
} from '../Middlewares/validate.middleware.js';
import { createUrlLimiter } from '../Middlewares/rateLimiter.middleware.js';

const router = Router();

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
router.delete('/delete/:id', authMiddleware, deleteUrl);

export default router;
