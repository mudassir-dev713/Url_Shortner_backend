const express = require('express');
const { authMiddleware } = require('../Middlewares/auth.middleware.js');
const { analytics } = require('../Controllers/analytics.controller.js');

const router = express.Router();

router.get('/summary/:urlId', authMiddleware, analytics);

module.exports = router;
