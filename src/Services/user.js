import bcrypt from 'bcryptjs';
import User from '../Models/user.model.js';
import { AppError } from '../utils/errorHandler.js';
import { generateAccessToken, generateRefreshToken } from '../utils/helper.js';

export const createUser = async (name, email, password) => {
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400); // ✅ Throw error directly
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Generate tokens
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  return { user: newUser, accessToken, refreshToken };
};

export const login = async (email, password) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
  } catch (err) {
    // Avoid double-wrapping if already AppError
    if (err instanceof AppError) throw err;

    throw new AppError('Failed to login user', 500);
  }
};
