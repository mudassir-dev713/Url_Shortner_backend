const express = require('express');
const {
  loginUser,
  refreshAccessToken,
  registerUser,
  getUser,
  logoutUser,
} = require('../Controllers/auth.controller.js');
const { authMiddleware } = require('../Middlewares/auth.middleware.js');
const {
  validateLogin,
  validateSignup,
} = require('../Middlewares/validate.middleware.js');
const { authLimiter } = require('../Middlewares/rateLimiter.middleware.js');

const router = express.Router();

router.post('/register', authLimiter, validateSignup, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getUser);
router.get('/refresh', refreshAccessToken);

module.exports = router;
