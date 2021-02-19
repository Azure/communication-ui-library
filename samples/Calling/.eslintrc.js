// © Microsoft Corporation. All rights reserved.

module.exports = {
  extends: [
    "../../.eslintrc.js",
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      "files": ["App.tsx"],
      "rules": {
        // Allow requiring the package.json
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
};
