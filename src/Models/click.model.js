import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
  ip: String,
  country: String,
  browser: String,
  deviceType: String,
  isBot: Boolean,
  referrer: String,
  hour: Number,
  createdAt: { type: Date, default: Date.now },
});
const Click = mongoose.model('Click', clickSchema);
export default Click;
