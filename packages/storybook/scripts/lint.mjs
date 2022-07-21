#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

function main() {
  if (getBuildFlavor() === 'stable') {
    console.log('Skipping storybook lint for stable build');
    return;
  }
  exec(quote(['npx', 'eslint', '--max-warnings', '0', '*/**/*.{ts,tsx,mdx}', ...process.argv.slice(2)]));
}

main();
