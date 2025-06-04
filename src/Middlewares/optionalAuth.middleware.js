const User = require('../Models/user.model.js');
const { verifyAccessToken } = require('../utils/helper.js');

const optionalAuth = async (req, res, next) => {
  try {
   let token;

    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

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

module.exports = {
  optionalAuth,
};
