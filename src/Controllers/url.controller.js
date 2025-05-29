import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from '../Services/createShortUrl.js';
import urlSchemaModel from '../Models/shortUrl.model.js';
import { AppError, catchAsync } from '../utils/errorHandler.js';
import Click from '../Models/click.model.js';

// Short Url

export const createShortUrl = catchAsync(async (req, res, next) => {
  let { url } = req.body;
  let shorturl;
  if (!url) return next(new AppError('URL is required', 400));

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  const userid = req.user?._id;

  if (userid) {
    shorturl = await createShortUrlWithUser(url, userid);
  } else {
    shorturl = await createShortUrlWithoutUser(url);
  }

  res.status(200).json({
    message: 'Short URL created successfully',
    short_url: process.env.APP_URL + shorturl.short_url,
    full_url: url,
  });
});
//Custom  Short Url

export const createCustomUrl = catchAsync(async (req, res, next) => {
  let { url, slug } = req.body;
  const userid = req.user._id;
  if (!url) return next(new AppError('URL is required', 400));
  if (!slug) return next(new AppError('Custom URL is required', 400));

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const shorturl = await createShortUrlWithUser(url, userid, slug);

  res.status(200).json({
    message: 'Short URL created successfully',
    short_url: process.env.APP_URL + shorturl.short_url,
    full_url: url,
  });
});

// delete url
export const deleteUrl = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  const url = await urlSchemaModel.findOneAndDelete({ _id: id });
  const clicks = await Click.deleteMany({ urlId: id });

  res.status(200).json({
    message: 'Short URL deleted successfully',
  });
});
