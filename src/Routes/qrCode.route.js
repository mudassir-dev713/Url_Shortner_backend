const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  getUserQRCodes,
  deleteQRCodeById,
  getQrCodesByAnonId,
  transferQrCodesToUser,
} = require('../Controllers/qrCode.controller.js');
const { optionalAuth } = require('../Middlewares/optionalAuth.middleware.js');
const { authMiddleware } = require('../Middlewares/auth.middleware.js');
const { validateURL } = require('../Middlewares/validate.middleware.js');
const {
  createUrlLimiter,
} = require('../Middlewares/rateLimiter.middleware.js');

router.post('/', optionalAuth, validateURL, generateQRCode);
router.get('/:userId', getUserQRCodes); // Get all QR codes by user
router.get('/anon/:anonId', getQrCodesByAnonId);
router.post('/transfer', authMiddleware, transferQrCodesToUser);
router.delete('/delete/:id', deleteQRCodeById);

module.exports = router;
