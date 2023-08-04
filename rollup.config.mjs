import { extname } from 'path';

import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { hoistImportDeps } from 'rollup-plugin-hoist-import-deps';

import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import inlineSvg from 'rollup-plugin-inline-svg';

import * as sass from 'sass';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

import postcssPlugin from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-lit-css';
import strip from '@rollup/plugin-strip';
import watchPlugin from 'rollup-plugin-watch';
import serve from 'rollup-plugin-serve2';
import livereload from 'rollup-plugin-livereload';
import filesize from 'rollup-plugin-filesize';

const watch = process.env.ROLLUP_WATCH;
const production = process.env.NODE_ENV !== 'development';

let processor;

async function getPostCssRcProcessor() {
  const { plugins } = await postcssrc();
  processor = postcss(plugins);
}

const getFiles = (bundle) => {
  const files = Object.values(bundle).filter(
    (file) =>
      file.type === 'chunk' ||
      (typeof file.type === 'string' ? file.type === 'asset' : file.isAsset)
  );

  const result = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const { fileName: name } = file;
    const extension = extname(name).substring(1);

    result[extension] = (result[extension] || []).concat(file);
  }

  return result;
};

const baseConfig = createSpaConfig({
  outputDir: 'public',
  terser: production
    ? {
        ecma: 2019,
        module: true,
        warnings: true,
      }
    : false,
  html: {
    extractAssets: false,
    minify: production,
    transformHtml: [
      // interpolate with loadash.template
      /*
      (html) => {
        const compiled = template(
          html.replaceAll('&lt;%=', '<%=').replaceAll('%&gt;', '%>')
        );

        return compiled({
          version,
          timestamp,
          date: new Date(timestamp).toLocaleDateString('en-US'),
        });
      },
      */
      // inline main style
      (html, test) => {
        const { css } = getFiles(test.bundles.module.bundle);

        return html.replace(
          '</head>',
          `<style>${css[0].source}</style>\n</head>`
        );
      },
      // fix IE 11 error script1006 (default parameter)
      (html) =>
        html.replace(
          'function loadScript(src, type, attributes = []) {',
          `
    function loadScript(src, type, attributes) {
      if(!attributes) { attributes = []; }
      `
        ),
      // fix IE 11 error script1002 (arrow function)
      (html) =>
        html.replace(
          'attributes.forEach(att => {',
          `
        attributes.forEach(function (att) {`
        ),
      // fix Safari 11 need corejs
      (html) =>
        html.replace(
          `
  if (!('noModule' in HTMLScriptElement.prototype)) {
    var s = document.createElement('script');`,
          `
  if (!('noModule' in HTMLScriptElement.prototype) || typeof(globalThis) === 'undefined') {
    var s = document.createElement('script');`
        ),
      // replace preload by modulepreload
      (html) =>
        html.replace(/rel="preload" href="/g, 'rel="modulepreload" href="'),
    ],
  },
  polyfillsLoader: {
    legacyOutput: {
      test: "!('noModule' in HTMLScriptElement.prototype)",
    },
    polyfills: {
      hash: production,
      minify: production,
      coreJs: true,
      regeneratorRuntime: true,
      fetch: true,
      webcomponents: true,
      // required for interfacing with the webcomponents polyfills
      custom: [
        {
          name: 'lit-polyfill-support',
          path: 'node_modules/lit/polyfill-support.js',
          test: "!('attachShadow' in Element.prototype)",
          minify: production,
          module: false,
        },
      ],
    },
  },

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: !production,

  workbox: false,

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

baseConfig.output[0].sourcemap = true;
baseConfig.output[1].sourcemap = true;

baseConfig.output[0].entryFileNames = `[name]${production ? '.[hash]' : ''}.js`;
baseConfig.output[1].entryFileNames = `nomodule.[name]${
  production ? '.[hash]' : ''
}.js`;

baseConfig.output[0].chunkFileNames = `[name]${production ? '.[hash]' : ''}.js`;
baseConfig.output[1].chunkFileNames = `nomodule.[name]${
  production ? '.[hash]' : ''
}.js`;

baseConfig.output[0].manualChunks = (id) => {
  if (id.includes('node_modules')) {
    return 'vendor';
  }

  return undefined;
};

baseConfig.output[1].manualChunks = (id) => {
  if (id.includes('node_modules')) {
    return 'vendor';
  }

  return undefined;
};

baseConfig.output[0].compact = production;
baseConfig.output[1].compact = production;

baseConfig.plugins = baseConfig.plugins.filter(
  (plugin) =>
    plugin &&
    !['rollup-plugin-import-meta-assets', 'node-resolve'].includes(plugin.name)
);

export default merge(baseConfig, {
  input: './src/index.html',
  plugins: [
    nodeResolve({
      browser: true,
      dedupe: ['lit-html', 'lit-element', 'lit'],
      exportConditions: [!production ? 'development' : null],
    }),
    commonjs(),
    hoistImportDeps(),
    copy({
      targets: [{ src: 'static/**/*', dest: 'public' }],
    }),
    json({
      compact: production,
      preferConst: true,
    }),
    inlineSvg({
      removeSVGTagAttrs: false,
    }),
    postcssPlugin({
      extract: 'app.css',
      include: ['./src/scss/app.scss'],
      minimize: false,
      sourceMap: true,
    }),
    litcss({
      include: /\.scss$/i,
      exclude: ['./src/scss/app.scss'],
      transform: async (source, { filePath }) => {
        const { css: compiledCss } = sass.compileString(source, {
          loadPaths: ['./src/scss'],
          style: production ? 'compressed' : 'expanded',
          sourceMap: false,
        });

        if (!processor) {
          await getPostCssRcProcessor();
        }

        const { css } = await processor.process(compiledCss, {
          from: filePath,
          map: false,
        });

        return css;
      },
    }),
    production && strip(),
    production &&
      minifyHTML.default({
        options: {
          minifyOptions: {
            minifyCSS: false,
          },
        },
      }),
    production && filesize({ showMinifiedSize: false }),
    watch &&
      watchPlugin({
        dir: './static',
        include: /\.scss$/i,
      }),
    watch &&
      serve({
        open: false,
        contentBase: 'public',
        port: process.env.PORT || 4000,
        verbose: !process.env.PORT,
      }),
    watch &&
      livereload({
        watch: ['public', 'api', 'serverless'],
        verbose: false,
        delay: 300,
      }),
  ],
});
