// middlewares/optionalAuth.js
import User from '../Models/user.model.js';

import { verifyAccessToken } from '../utils/helper.js';
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) return next(); // No token, continue as guest

    const decoded = verifyAccessToken(token);

    const currentUser = await User.findById(decoded.id);

    if (currentUser) {
      req.user = currentUser; // Attach user
    }
  } catch (err) {
    // Invalid token or other issues - proceed without user
  }
  next();
};
