const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    anonId: {
      type: String,

      default: null,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
