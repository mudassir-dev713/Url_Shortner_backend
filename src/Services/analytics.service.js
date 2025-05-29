import geoip from 'geoip-lite';

export function extractIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
}

export async function getGeoInfo(ip) {
  if (!ip || ip.startsWith('::1')) return { country: 'Local', city: 'Local' };
  const geo = geoip.lookup(ip);
  return {
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
  };
}

export function getBrowserAndDevice(req) {
  const browser = req.useragent?.browser || 'Unknown';
  const deviceType = req.useragent?.isMobile
    ? 'Mobile'
    : req.useragent?.isTablet
    ? 'Tablet'
    : 'Desktop';
  return { browser, deviceType };
}
