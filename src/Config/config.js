const AccessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 15 * 60 * 1000,
};

const RefreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  AccessCookieOptions,
  RefreshCookieOptions,
};
