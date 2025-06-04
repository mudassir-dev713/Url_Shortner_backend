const urlSchemaModel = require('../Models/shortUrl.model');
const { AppError } = require('../utils/errorHandler');
const { generateNanoId, getCustomShortUrl } = require('../utils/helper');

async function createShortUrlWithoutUser(url, anonId) {
  try {
    const urlShort = new urlSchemaModel({
      full_url: url,
      short_url: await generateNanoId(8),
      anonId: anonId,
    });

    await urlShort.save();
    return urlShort;
  } catch (err) {
    throw new AppError('Failed to create short URL', 500);
  }
}

async function createShortUrlWithUser(url, user, slug = null) {
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
    if (err instanceof AppError) {
      throw err;
    }
    console.error('Unexpected error in createShortUrlWithUser:', err);
    throw new AppError('Failed to create short URL for user', 500);
  }
}

module.exports = {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
};
