/* eslint-disable no-console */
const Bal = require('../serverless/Bal');

const handleError = (req, res, e, data = {}) => {
  const { heightMin, heightMax } = data;

  console.log(req.headers);

  console.error(e);

  const body = JSON.stringify({
    error: {
      message: e.message,
    },
    data: {
      heightMax,
      heightMin,
    },
  });

  // res.statusCode = 400;

  return res
    .writeHead(400, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json; charset=utf-8',
      // 'Cache-Control': 'max-age=0, s-maxage=86400'
    })
    .end(body);
};

module.exports = function handler(req, res) {
  const { position, style, height } = Object.fromEntries(
    new URL(req.url, `http://${req.headers.host}`).searchParams
  );

  let bal;
  let stats;

  // res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');

  try {
    bal = new Bal(position, Number(height), style);
  } catch (e) {
    return handleError(req, res, e);
  }

  try {
    stats = bal.getStats();
  } catch (e) {
    return handleError(req, res, e, bal.data);
  }

  const body = JSON.stringify(stats);

  return res
    .writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=86400',
    })
    .end(body);

  // return res.end(JSON.stringify(stats));
};
