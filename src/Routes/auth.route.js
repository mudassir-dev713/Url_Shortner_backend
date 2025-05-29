import { Router } from 'express';
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  getUser,
  logoutUser,
} from '../Controllers/auth.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import {
  validateLogin,
  validateSignup,
} from '../Middlewares/validate.middleware.js';
import { authLimiter } from '../Middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/register', authLimiter, validateSignup, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getUser);
router.get('/refresh', refreshAccessToken);

export default router;
