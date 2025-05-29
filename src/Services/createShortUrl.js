import urlSchemaModel from '../Models/shortUrl.model.js';
import { AppError } from '../utils/errorHandler.js';
import { generateNanoId, getCustomShortUrl } from '../utils/helper.js';

export const createShortUrlWithoutUser = async (url) => {
  try {
    const urlShort = new urlSchemaModel({
      full_url: url,
      short_url: await generateNanoId(8),
    });

    await urlShort.save();
    return urlShort;
  } catch (err) {
    throw new AppError('Failed to create short URL', 500);
  }
};

export const createShortUrlWithUser = async (url, user, slug = null) => {
  try {
    const shorturl = slug || (await generateNanoId(8));

    if (slug) {
      const check = await getCustomShortUrl(slug);
      if (check) {
        throw new AppError('This short url already exists', 400);
      }
    }

    const urlShort = new urlSchemaModel({
      full_url: url,
      short_url: shorturl,
      user,
    });

    await urlShort.save();
    return urlShort;
  } catch (err) {
    // ✅ Keep original AppErrors
    if (err instanceof AppError) {
      throw err;
    }

    // 🐛 Log and wrap unknown errors
    console.error('Unexpected error in createShortUrlWithUser:', err);
    throw new AppError('Failed to create short URL for user', 500);
  }
};
