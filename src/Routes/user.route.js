import { Router } from 'express';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { getUrl } from '../Controllers/user.controller.js';

const router = Router();

router.get('/geturl', authMiddleware, getUrl);

export default router;
