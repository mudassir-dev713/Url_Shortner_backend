import { isbot } from 'isbot';
import urlSchemaModel from '../Models/shortUrl.model.js';
import { catchAsync } from '../utils/errorHandler.js';
import Click from '../Models/click.model.js';
import {
  extractIp,
  getBrowserAndDevice,
  getGeoInfo,
} from '../Services/analytics.service.js';

export const redirectToOriginalUrl = catchAsync(async (req, res, next) => {
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
    const referrer = req.get('referer') || 'Direct'; // fix header
    const hour = new Date().getHours(); // local hour (use getUTCHours if needed)

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

    res.redirect(url.full_url);
  } else {
    res.redirect(url.full_url);
  }
});
