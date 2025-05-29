import urlSchemaModel from '../Models/shortUrl.model.js';
import { catchAsync } from '../utils/errorHandler.js';

export const getUrl = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;

    const urls = await urlSchemaModel.find({ user: userId });

    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
});
