import { AppError, catchAsync } from '../utils/errorHandler.js';
import { createUser, login } from '../Services/user.js';
import { AccessCookieOptions, RefreshCookieOptions } from '../Config/config.js';
import { generateAccessToken, verifyRefreshToken } from '../utils/helper.js';

export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  //  Basic validation
  if (!name || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }
  const { user, accessToken, refreshToken } = await createUser(
    name,
    email,
    password
  );

  res.cookie('accessToken', accessToken, AccessCookieOptions);
  res.cookie('refreshToken', refreshToken, RefreshCookieOptions);
  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //  Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const { user, accessToken, refreshToken } = await login(email, password);
  res.cookie('accessToken', accessToken, AccessCookieOptions);
  res.cookie('refreshToken', refreshToken, RefreshCookieOptions);

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const logoutUser = catchAsync(async (req, res, next) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    message: 'User is Logged out',
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.user });
});
export const refreshAccessToken = (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new AppError('Refresh token missing', 401));

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id);
    res.cookie('accessToken', newAccessToken, AccessCookieOptions);
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    return next(new AppError('Invalid refresh token', 403));
  }
};
