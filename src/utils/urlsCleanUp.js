
const urlSchemaModel = require('../Models/shortUrl.model.js');

const deleteOldAnonymousUrls = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await urlSchemaModel.deleteMany({
    user: { $exists: false },
    createdAt: { $lt: sevenDaysAgo },
  });

  console.log(`[Cleanup] Deleted ${result.deletedCount} anonymous URLs`);
};
module.exports = {
  deleteOldAnonymousUrls,
};