const crypto = require('crypto');
const fs = require('fs');

function hash(css, algorithm) {
  return crypto.createHash(algorithm).update(css).digest('base64');
}

function readJson(f) {
  try {
    const data = fs.readFileSync(f, 'utf-8');

    if (data && data.length > 0) {
      return JSON.parse(data);
    }

    return {};
  } catch (e) {
    return {};
  }
}

module.exports = () => {
  const opts = {
    algorithm: 'sha256',
    out: './data/csp-hashes.json',
  };

  return {
    postcssPlugin: 'postcss-csp-style-src-hash',
    OnceExit(root) {
      const csp = readJson(opts.out);

      if (!csp['style-src']) {
        csp['style-src'] = [];
      }

      csp['style-src'] = [...csp['style-src']];

      csp['style-src'].push(
        `'${opts.algorithm}-${hash(root.toString(), opts.algorithm)}'`
      );

      const data = JSON.stringify(csp, null, 2);
      fs.writeFileSync(opts.out, data, 'utf-8');
    },
  };
};

module.exports.postcss = true;
