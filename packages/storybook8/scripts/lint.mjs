#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getBuildFlavor, exec } from './common.mjs';
import { fileURLToPath } from 'node:url';

async function main() {
  if (getBuildFlavor() === 'stable') {
    console.log('Skipping storybook lint for stable build');
    return;
  }
  await exec([
    process.execPath,
    fileURLToPath(new URL('../node_modules/eslint/bin/eslint.js', import.meta.url)),
    '--max-warnings',
    '0',
    '*/**/*.{ts,tsx,mdx}',
    ...process.argv.slice(2)
  ]);
}

await main();
