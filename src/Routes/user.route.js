const express = require('express');
const { authMiddleware } = require('../Middlewares/auth.middleware.js');
const { getUrl } = require('../Controllers/user.controller.js');

const router = express.Router();

router.get('/geturl', authMiddleware, getUrl);

module.exports = router;
