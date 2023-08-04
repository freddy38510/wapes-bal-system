const { auth, sheets } = require('@googleapis/sheets');
require('dotenv').config();

/** @type { import('@googleapis/sheets').sheets_v4.Sheets} */
let cached;

async function getAuthClient() {
  return new auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    },
  }).getClient();
}

module.exports = async () => {
  if (cached) {
    // console.log('cached Google Sheet client');

    return cached;
  }

  // console.log('fresh Google Sheet client');

  cached = sheets({
    version: 'v4',
    auth: await getAuthClient(),
    timeout: 3000,
  });

  return cached;
};
