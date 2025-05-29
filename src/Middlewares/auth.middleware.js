import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';
import User from '../Models/user.model.js';
import { verifyAccessToken } from '../utils/helper.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header: "Bearer <token>

    token = req.cookies.accessToken;

    if (!token) {
      throw new AppError('You are not logged in! Please login.', 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new AppError(
        'The user belonging to this token no longer exists.',
        401
      );
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    throw new AppError('You are not logged in! Please login.', 401);
  }
};
