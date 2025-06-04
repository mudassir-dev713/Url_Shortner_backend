const express = require('express');
const userSchemaModel = require('../Models/user.model.js');
const urlSchemaModel = require('../Models/shortUrl.model.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await userSchemaModel.countDocuments();
    const urls = await urlSchemaModel.find();

    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

    res.json({
      users,
      urls: urls.length,
      clicks: totalClicks,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
