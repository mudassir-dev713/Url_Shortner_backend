import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { UAParser } from 'ua-parser-js';

import urlSchemaModel from '../Models/shortUrl.model.js';

export const generateNanoId = (length) => {
  return nanoid(length);
};
export const getCustomShortUrl = async (url) => {
  return await urlSchemaModel.findOne({ short_url: url });
};
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
export const UAParserfn = (userAgent) => {
  const parsed = new UAParser(userAgent);
  return {
    browser: parsed.browser.name,
    deviceType: parsed.device.type || 'Desktop',
  };
};
