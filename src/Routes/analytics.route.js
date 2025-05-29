import { Router } from 'express';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { analytics } from '../Controllers/analytics.controller.js';

const router = Router();

router.get('/summary/:urlId', authMiddleware, analytics);

export default router;
