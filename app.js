import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './src/Config/mongoDb.config.js';
import urlRoutes from './src/Routes/url.route.js';
import authRoutes from './src/Routes/auth.route.js';
import userRoutes from './src/Routes/user.route.js';
import statsRoutes from './src/Routes/stats.route.js';
import analyticsRoutes from './src/Routes/analytics.route.js';
import { redirectToOriginalUrl } from './src/Controllers/redirect.controller.js';
import { errorMiddleware } from './src/utils/errorHandler.js';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import { generalApiLimiter } from './src/Middlewares/rateLimiter.middleware.js';
import helmet from 'helmet';
import { sanitizeQuery } from './src/Middlewares/sanitizeQuery.middleware.js';
import { sanitizeBodyParams } from './src/Middlewares/sanitizeBodyParams.middleware.js';
import customXssClean from './src/Middlewares/xssClean.middleware.js';
import compression from 'compression';
dotenv.config('./.env');
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(sanitizeQuery);
app.use(sanitizeBodyParams);

app.use(compression());
app.use(customXssClean);
app.use(helmet());
app.use(useragent.express());
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/api', generalApiLimiter, urlRoutes);
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/stats', statsRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/:id', redirectToOriginalUrl);
app.use(errorMiddleware);

app.listen(process.env.PORT, (req, res) => {
  connectdb();
  console.log('app is running on Port:' + process.env.PORT);
});
