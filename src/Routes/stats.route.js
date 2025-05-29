import { Router } from 'express';
import userSchemaModel from '../Models/user.model.js';
import urlSchemaModel from '../Models/shortUrl.model.js';

const router = Router();

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

export default router;
