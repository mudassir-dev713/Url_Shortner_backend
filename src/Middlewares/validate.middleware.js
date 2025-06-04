const validator = require('validator');

const validateSignup = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Invalid or missing email';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Invalid or missing email';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateURL = (req, res, next) => {
  const { url } = req.body;

  if (!url || !validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({
      success: false,
      error: 'A valid URL with http/https is required',
    });
  }

  next();
};

const validateCustomUrl = (req, res, next) => {
  const { url, slug } = req.body;

  if (!url || !validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ error: 'A valid original URL is required' });
  }

  if (!slug || !/^[a-zA-Z0-9-_]{1,20}$/.test(slug)) {
    return res.status(400).json({
      error:
        'Custom alias must be 3–20 characters (letters, numbers, hyphen, underscore)',
    });
  }

  next();
};

module.exports = {

  validateSignup,
  validateLogin,
  validateURL,
  validateCustomUrl,
};