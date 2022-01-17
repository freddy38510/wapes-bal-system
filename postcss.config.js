const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cspStyleSrcHash = require('./postcss-csp-style-src-hash');

const production = process.env.NODE_ENV !== 'development';

module.exports = {
  plugins: [
    autoprefixer,
    production && cssnano(),
    production && cspStyleSrcHash(),
  ],
};
