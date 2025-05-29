import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { deleteOldAnonymousUrls } from './src/utils/urlsCleanUp.js';

dotenv.config();

const MONGO_URI = process.env.MongoDB_URL;

const runCleanup = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Cleanup] Connected to MongoDB');

    await deleteOldAnonymousUrls();

    await mongoose.disconnect();
    console.log('[Cleanup] Disconnected from MongoDB');
  } catch (err) {
    console.error('[Cleanup] Failed:', err);
    process.exit(1);
  }
};

runCleanup();
