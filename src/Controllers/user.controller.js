const urlSchemaModel = require('../Models/shortUrl.model.js');
const { catchAsync } = require('../utils/errorHandler.js');

const getUrl = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;

    const urls = await urlSchemaModel.find({ user: userId });

    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getUrl,
};
