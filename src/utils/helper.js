// utils/helper.js
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const UAParser = require('ua-parser-js');
const urlSchemaModel = require('../Models/shortUrl.model');

const generateNanoId = (length) => {
  return nanoid(length);
};

const getCustomShortUrl = async (url) => {
  return await urlSchemaModel.findOne({ short_url: url });
};

const generateAccessToken = (userId) => {
  
  return  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId) => {
  
  
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const UAParserfn = (userAgent) => {
  const parser = new UAParser(userAgent);
  return {
    browser: parser.getBrowser().name,
    deviceType: parser.getDevice().type || 'Desktop',
  };
};


module.exports = {
  generateNanoId,
  getCustomShortUrl,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  UAParserfn,
};
