const bcrypt = require('bcryptjs');
const User = require('../Models/user.model');
const { AppError } = require('../utils/errorHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/helper');

async function createUser(name, email, password) {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);
  return { user: newUser, accessToken, refreshToken };
}

async function login(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }


    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);


    return { user, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError('Failed to login user', 500);
  }
}

module.exports = {
  createUser,
  login,
};
