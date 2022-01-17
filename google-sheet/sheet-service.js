const { AuthPlus, sheets } = require('@googleapis/sheets');
require('dotenv').config();

let cached;

const getAuthClient = async () => {
  const { GoogleAuth } = new AuthPlus();

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    },
  });

  return auth.getClient();
};

module.exports = async () => {
  if (cached) {
    // console.log('cached Google Sheet client');

    return cached;
  }

  // console.log('fresh Google Sheet client');

  const authClient = await getAuthClient();

  cached = sheets({
    version: 'v4',
    auth: authClient,
    timeout: 3000,
  });

  return cached;
};
