#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

function main() {
  if (getBuildFlavor() === 'stable') {
    console.warn('Skipping storybook test for stable build');
    return;
  }
  exec('rushx test:snippets');
  exec(quote(['npx', 'jest', ...process.argv.slice(2)]));
}

main();
