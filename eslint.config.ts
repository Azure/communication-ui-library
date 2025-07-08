// Root ESLint flat config for the monorepo
// This file aggregates per-package configs if needed

import compositesConfig from './packages/react-composites/eslint.config.ts';
// import other package configs as needed

export default [
  ...compositesConfig
  // ...other configs
];
