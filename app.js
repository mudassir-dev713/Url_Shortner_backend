const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require('./src/Config/mongoDb.config.js');
const urlRoutes = require('./src/Routes/url.route.js');
const authRoutes = require('./src/Routes/auth.route.js');
const userRoutes = require('./src/Routes/user.route.js');
const statsRoutes = require('./src/Routes/stats.route.js');
const analyticsRoutes = require('./src/Routes/analytics.route.js');
const qrRoutes = require('./src/Routes/qrCode.route.js');

const {
  redirectToOriginalUrl,
} = require('./src/Controllers/redirect.controller.js');
const { errorMiddleware } = require('./src/utils/errorHandler.js');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const {
  generalApiLimiter,
} = require('./src/Middlewares/rateLimiter.middleware.js');
const helmet = require('helmet');
const {
  sanitizeQuery,
} = require('./src/Middlewares/sanitizeQuery.middleware.js');
const {
  sanitizeBodyParams,
} = require('./src/Middlewares/sanitizeBodyParams.middleware.js');
const customXssClean = require('./src/Middlewares/xssClean.middleware.js');
const compression = require('compression');

dotenv.config(); // Loads from .env by default

const app = express();

app.use(
  cors({
    // origin: process.env.FRONTEND_URL,
    origin: 'http://localhost:5173',
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
app.use(express.urlencoded({ extended: true }));

app.use('/api', urlRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/stats', statsRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/:id', redirectToOriginalUrl);
app.use(errorMiddleware);

connectdb()
  .then(() => {
    console.log('MongoDB is connected');
    app.listen(process.env.PORT, () => {
      console.log('App is running on port: ' + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Stop app if DB isn't connected
  });
