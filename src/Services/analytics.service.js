const geoip = require('geoip-lite');

function extractIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
}

async function getGeoInfo(ip) {
  if (!ip || ip.startsWith('::1')) return { country: 'Local', city: 'Local' };
  const geo = geoip.lookup(ip);
  return {
    country: (geo && geo.country) || 'Unknown',
    city: (geo && geo.city) || 'Unknown',
  };
}

function getBrowserAndDevice(req) {
  const ua = req.useragent || {};
  const browser = ua.browser || 'Unknown';
  const deviceType = ua.isMobile
    ? 'Mobile'
    : ua.isTablet
    ? 'Tablet'
    : 'Desktop';
  return { browser, deviceType };
}

module.exports = {
  extractIp,
  getGeoInfo,
  getBrowserAndDevice,
};
