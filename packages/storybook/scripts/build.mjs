#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    console.log('Skipping storybook build for stable build');
    return;
  }
  await exec(quote(['npx', 'build-storybook', '--quiet', '--loglevel', 'warn', ...process.argv.slice(2)]), {
    NODE_OPTIONS: '--openssl-legacy-provider' // Storybook needs this for use with node 18; resolved in storybook v7
  });
}

await main();
