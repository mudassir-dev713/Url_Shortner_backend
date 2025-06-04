const { AppError, catchAsync } = require('../utils/errorHandler.js');
const { createUser, login } = require('../Services/user.js');
const {
  AccessCookieOptions,
  RefreshCookieOptions,
} = require('../Config/config.js');
const {
  generateAccessToken,
  verifyRefreshToken,
} = require('../utils/helper.js');

const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  const { user, accessToken, refreshToken } = await createUser(
    name,
    email,
    password
  );

 
  res.status(201).json({
    newUser: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,refreshToken
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const { user, accessToken, refreshToken } = await login(email, password);


  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,refreshToken
  });
});

const logoutUser = catchAsync(async (req, res, next) => {
  
  res.clearCookie('accessToken',);
  res.clearCookie('refreshToken',);

  res.status(200).json({
    message: 'User is Logged out',
  });
});

const getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.user });
});

const refreshAccessToken = (req, res, next) => {
  const refreshToken = req.headers['x-refresh-token'];

console.log(refreshToken)
  if (!refreshToken) {
    return next(new AppError('Refresh token missing', 401));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken); // Verifies signature & expiry
    const newAccessToken = generateAccessToken(decoded.id);

    // Optionally return new refreshToken here too if rotating
    res.status(200).json({
      accessToken: newAccessToken,
      message: 'Access token refreshed',
    });
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 403));
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  refreshAccessToken,
};
