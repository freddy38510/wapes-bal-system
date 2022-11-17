module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 10,
    // sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      parser: '@babel/eslint-parser',
      extends: [
        'airbnb-base',
        'plugin:wc/recommended',
        'plugin:lit/recommended',
        'prettier',
      ],
    },
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'scripts/generate-data.js',
          'scripts/set-csp.js',
          'rollup.config.mjs',
          'postcss.config.js',
          'postcss-csp-style-src-hash.js',
        ],
      },
    ],
  },
};
