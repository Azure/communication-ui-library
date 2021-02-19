// © Microsoft Corporation. All rights reserved.

module.exports = {
  extends: ["../../.eslintrc.js"],
  rules: {
    // Allow unused vars for routing funtions
    '@typescript-eslint/no-unused-vars': ['off']
  },
  overrides: [
    {
      "files": ["envHelper.ts"],
      "rules": {
        // Allow requiring the appsettings.json
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};
