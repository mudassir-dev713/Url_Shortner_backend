export const AccessCookieOptions = {
  httpOnly: true, // Prevents JS access to cookie
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // Helps prevent CSRF
  maxAge: 15 * 60 * 1000,
};

export const RefreshCookieOptions = {
  httpOnly: true, // Prevents JS access to cookie
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // Helps prevent CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
