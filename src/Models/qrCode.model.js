const mongoose = require('mongoose');

const QrUrlSchema = new mongoose.Schema({
  url: {
    type: String,

    required: true,
  },
  qrCode: {
    type: String,

    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  anonId: {
    type: String,

    default: null,
  },
  createdAt: {
    type: Date,

    default: Date.now,
  },
});

module.exports = mongoose.model('QrUrl', QrUrlSchema);
