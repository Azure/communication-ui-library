// © Microsoft Corporation. All rights reserved.

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['header'],
  rules: {
    eqeqeq: 'warn'
  }
};
