const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler.js');
const User = require('../Models/user.model.js');
const { verifyAccessToken } = require('../utils/helper.js');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please login.', 401));
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please login again.', 401));
  }
};

module.exports = {
  authMiddleware,
};
