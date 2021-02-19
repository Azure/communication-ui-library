// © Microsoft Corporation. All rights reserved.

module.exports = {
  extends: "../../.eslintrc.js",
  overrides: [
    {
      "files": ["App.tsx"],
      "rules": {
        // Allow requiring the package.json
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};
