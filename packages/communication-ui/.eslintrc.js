// © Microsoft Corporation. All rights reserved.

module.exports = {
  extends: [
    "../../.eslintrc.js",
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Do not allow references that are outside the src folder. These will break the npm package created as no src dir exists in output dir.
          '**/../**/src/*',
          // Do not allow references to node_modules' /es/ folder. These will break jest tests and the npm package as those imports won't be transpiled.
          '**/dist/**/es/*',
          '**/lib/**/es/*'
        ]
      }
    ],
    // todo: re-enable this rule
    'react/display-name': 'off'
  },
  root: true,
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    },
    {
      // remove the ban on certain types due to the complexity of this file
      files: ['ConnectContext.tsx'],
      rules: {
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ],
};
