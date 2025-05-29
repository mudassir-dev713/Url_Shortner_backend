import Click from '../Models/click.model.js';
import mongoose from 'mongoose';

export const analytics = async (req, res) => {
  const { urlId } = req.params;
  const objId = new mongoose.Types.ObjectId(urlId);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const botCount = await Click.countDocuments({ urlId: objId, isBot: true });

  const [
    totalClicks,
    uniqueIps,
    topCountry,
    topBrowser,
    peakHour,
    growth,
    deviceBreakdown,
    topReferrers,
  ] = await Promise.all([
    Click.countDocuments({ urlId: objId }),

    Click.distinct('ip', { urlId: objId }),

    Click.aggregate([
      { $match: { urlId: objId } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    Click.aggregate([
      { $match: { urlId: objId } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    Click.aggregate([
      { $match: { urlId: objId } },
      {
        $group: {
          _id: '$hour', // or: { $hour: '$createdAt' } if you remove "hour" from schema
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    Click.aggregate([
      {
        $match: {
          urlId: objId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Click.aggregate([
      { $match: { urlId: objId } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
    ]),

    Click.aggregate([
      { $match: { urlId: objId } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]),
  ]);

  res.json({
    totalClicks,
    uniqueVisitors: uniqueIps.length,
    topCountry: topCountry[0]?._id || 'Unknown',
    topBrowser: topBrowser[0]?._id || 'Unknown',
    peakHour: peakHour[0]?._id || 'N/A',
    clickGrowth: growth,
    deviceBreakdown,
    botTraffic: botCount,
    topReferrers: topReferrers.map((r) => ({
      referrer: r._id,
      count: r.count,
    })),
  });
};
