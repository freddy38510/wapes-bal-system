/* eslint-disable no-console */
const fs = require('fs');
const { join } = require('path');
const { parse } = require('parse5');
const {
  findElements,
  getTagName,
  hasAttribute,
  getTextContent,
} = require('@web/parse5-utils');
const crypto = require('crypto');

const opts = {
  algorithm: 'sha256',
  out: './data/csp-hashes.json',
};

function readJson(f) {
  const data = fs.readFileSync(f, 'utf-8');

  if (data && data.length > 0) {
    return JSON.parse(data);
  }

  return {};
}

function isInlineScript(node) {
  if (getTagName(node) === 'script' && !hasAttribute(node, 'src')) {
    return true;
  }

  return false;
}

function isInlineStyle(node) {
  if (getTagName(node) === 'style') {
    return true;
  }

  return false;
}

function generateHashesFromHtml(document) {
  const inlineScripts = findElements(document, isInlineScript);
  const inlineStyles = findElements(document, isInlineStyle);
  const hashes = {
    scripts: [],
    styles: [],
  };

  inlineScripts.forEach((node) => {
    if (node.childNodes[0]) {
      const scriptContent = getTextContent(node.childNodes[0]);

      const hash = crypto
        .createHash(opts.algorithm)
        .update(scriptContent)
        .digest('base64');
      hashes.scripts.push(`'${opts.algorithm}-${hash}'`);
    }
  });

  inlineStyles.forEach((node) => {
    if (node.childNodes[0]) {
      const styleContent = getTextContent(node.childNodes[0]);

      const hash = crypto
        .createHash(opts.algorithm)
        .update(styleContent)
        .digest('base64');
      hashes.styles.push(`'${opts.algorithm}-${hash}'`);
    }
  });

  const csp = readJson(opts.out);

  csp['script-src'] = [...(csp['script-src'] || []), ...hashes.scripts];
  csp['style-src'] = [...(csp['style-src'] || []), ...hashes.styles];

  const data = JSON.stringify(csp, null, 2);

  fs.writeFileSync(opts.out, data, 'utf-8');
}

function setCSP() {
  const vercelConf = readJson('./vercel.build.json');
  const hashes = readJson('./data/csp-hashes.json');

  let idx;
  // let idx2;

  vercelConf.headers.forEach(({ source }, index) => {
    if (source === '/') {
      idx = index;
    }
  });

  vercelConf.headers[idx].headers.push({
    key: 'Content-Security-Policy',
    value: `object-src 'none'; base-uri 'self'; script-src 'self' ${hashes[
      'script-src'
    ].join(
      ' '
    )} 'strict-dynamic' https: 'unsafe-inline'; style-src 'self' ${hashes[
      'style-src'
    ].join(' ')} https: 'unsafe-inline';`,
  });

  /*
  vercelConf.headers[idx].headers.forEach(({ key }, index) => {
    if (key === 'Content-Security-Policy') {
      idx2 = index;
    }
  });
  */

  /*
  vercelConf.headers[idx].headers[
    idx2
  ].value = `object-src 'none'; base-uri 'self'; script-src 'self' ${hashes[
    'script-src'
  ].join(
    ' '
  )} 'strict-dynamic' https: 'unsafe-inline'; style-src 'self' ${hashes[
    'style-src'
  ].join(' ')} https: 'unsafe-inline';`;
  */

  const data = JSON.stringify(vercelConf, null, 2);
  fs.writeFileSync('./vercel.json', data, 'utf-8');

  console.log('CPS hashes updated in vercel.json');
}

const html = fs.readFileSync(join(__dirname, '../public/index.html'), 'utf-8');

generateHashesFromHtml(parse(html));

setCSP();

process.exit(0);
