const isbot = require('isbot');
const urlSchemaModel = require('../Models/shortUrl.model.js');
const { catchAsync, AppError } = require('../utils/errorHandler.js');
const Click = require('../Models/click.model.js');
const {
  extractIp,
  getBrowserAndDevice,
  getGeoInfo,
} = require('../Services/analytics.service.js');

const redirectToOriginalUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await urlSchemaModel.findOneAndUpdate(
    { short_url: id },
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (!url) return next(new AppError('Short URL not found', 404));

  if (url.user) {
    const ip = extractIp(req);
    const geo = await getGeoInfo(ip);
    const isBot = isbot(req.headers['user-agent'] || '');
    const { browser, deviceType } = getBrowserAndDevice(req);
    const referrer = req.get('referer') || 'Direct';
    const hour = new Date().getHours();

    await Click.create({
      urlId: url._id,
      ip,
      country: geo.country,
      city: geo.city,
      browser,
      deviceType,
      isBot,
      referrer,
      hour,
      createdAt: new Date(),
    });
  }

  res.redirect(url.full_url);
});

module.exports = {
  redirectToOriginalUrl,
};
