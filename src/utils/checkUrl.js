const axios = require('axios');

async function isSafeUrl(url) {
  const body = {
    client: {
      clientId: 'url',
      clientVersion: '1.0.0',
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API}`,
      body
    );

    // If matches is undefined, the URL is safe
    return !response.data.matches;
  } catch (error) {
    console.error('Safe Browsing error:', error.message);
    return false; //fail safe — assume unsafe if error
  }
}

module.exports = isSafeUrl;
