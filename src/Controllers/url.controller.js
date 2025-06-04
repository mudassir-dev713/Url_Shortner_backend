const {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} = require('../Services/createShortUrl.js');
const urlSchemaModel = require('../Models/shortUrl.model.js');
const { AppError, catchAsync } = require('../utils/errorHandler.js');
const Click = require('../Models/click.model.js');
const Url = require('../Models/shortUrl.model.js');
const isSafeUrl = require('../utils/checkUrl.js');

// Short Url
const createShortUrl = catchAsync(async (req, res, next) => {
  let { url, anonId } = req.body;
  const safe = await isSafeUrl(url);

  if (!url) return next(new AppError('URL is required', 400));

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  if (!safe)
    return next(
      new AppError('Malicious URL detected by Google Safe Browsing.', 400)
    );

  let shorturl;

  const userid = req.user ? req.user._id : null;

  if (userid) {
    shorturl = await createShortUrlWithUser(url, userid);
  } else {
    shorturl = await createShortUrlWithoutUser(url, anonId);
  }

  res.status(200).json({
    message: 'Short URL created successfully',
    short_url: shorturl.short_url,
    full_url: url,
  });
});

// Custom Short Url
const createCustomUrl = catchAsync(async (req, res, next) => {
  let { url, slug } = req.body;
  const safe = await isSafeUrl(url);

  if (!safe)
    return next(
      new AppError('Malicious URL detected by Google Safe Browsing.', 400)
    );
  const userid = req.user._id;

  if (!url) return next(new AppError('URL is required', 400));
  if (!slug) return next(new AppError('Custom URL is required', 400));

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const shorturl = await createShortUrlWithUser(url, userid, slug);

  res.status(200).json({
    message: 'Short URL created successfully',
    short_url: shorturl.short_url,
    full_url: url,
  });
});

// Delete URL
const deleteUrl = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  await urlSchemaModel.findOneAndDelete({ _id: id });
  await Click.deleteMany({ urlId: id });

  res.status(200).json({
    message: 'Short URL deleted successfully',
  });
});
getUrlByAnonId = async (req, res) => {
  const { anonId } = req.params;

  if (!anonId) {
    return res.status(400).json({ error: 'Missing anonymous ID' });
  }

  try {
    const urls = await Url.find({ anonId: anonId }).sort({
      createdAt: -1,
    });

    res.json(urls);
  } catch (err) {
    console.error('Fetch QR error:', err);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};
module.exports = {
  createShortUrl,
  createCustomUrl,
  deleteUrl,
  getUrlByAnonId,
};
