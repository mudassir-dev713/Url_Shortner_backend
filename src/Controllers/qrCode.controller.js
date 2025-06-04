const QRCode = require('qrcode');
const QrUrl = require('../Models/qrCode.model.js');
const Url = require('../Models/shortUrl.model.js');
const isSafeUrl = require('../utils/checkUrl.js');
const { AppError } = require('../utils/errorHandler.js');

exports.generateQRCode = async (req, res, next) => {
  const { url, anonId } = req.body;
  const safe = await isSafeUrl(url);

  if (!url || !url.startsWith('http')) {
    return next(new AppError('Invalid URL', 400));
  }
  if (!safe)
    return next(
      new AppError('Malicious URL detected by Google Safe Browsing.', 400)
    );

  const userId = req.user ? req.user._id : null; // fixed naming

  let qrEntry;

  try {
    const qrCode = await QRCode.toDataURL(url);

    if (userId) {
      qrEntry = new QrUrl({ url, qrCode, user: userId });
    } else {
      qrEntry = new QrUrl({ url, qrCode, anonId });
    }

    await qrEntry.save();

    res.status(201).json({ id: qrEntry._id, url, qrCode });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'QR code generation failed' });
  }
};

// GET: Fetch all QR codes for a user
exports.getUserQRCodes = async (req, res) => {
  const { userId } = req.params;

  try {
    const qrCodes = await QrUrl.find({ user: userId }).sort({ createdAt: -1 });
    res.json(qrCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};
// GET: Fetch all QR codes for a anonymous user

exports.getQrCodesByAnonId = async (req, res) => {
  const { anonId } = req.params;

  if (!anonId) {
    return res.status(400).json({ error: 'Missing anonymous ID' });
  }

  try {
    const qrCodes = await QrUrl.find({ anonId: anonId }).sort({
      createdAt: -1,
    });

    res.json(qrCodes);
  } catch (err) {
    console.error('Fetch QR error:', err);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};
// DELETE: Delete a QR code by its ID
exports.deleteQRCodeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await QrUrl.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'QR code not found' });

    res.json({ message: 'QR code deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete QR code' });
  }
};

exports.transferQrCodesToUser = async (req, res) => {
  const { anonId } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!anonId || !userId) {
    return res
      .status(400)
      .json({ error: 'Missing anonId or not authenticated' });
  }

  try {
    const result = await QrUrl.updateMany(
      { anonId, user: null }, // only transfer unassigned
      { $set: { user: userId }, $unset: { anonId: '' } }
    );
    const url = await Url.updateMany(
      { anonId, user: null }, // only transfer unassigned
      { $set: { user: userId }, $unset: { anonId: '' } }
    );
    res.json({
      message: 'QR codes transferred',
      updated: result.modifiedCount,
    });
  } catch (err) {
    console.error('QR transfer error:', err);
    res.status(500).json({ error: 'Failed to transfer QR codes' });
  }
};
