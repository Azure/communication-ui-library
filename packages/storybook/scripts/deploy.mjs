#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not deploy storybook from stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  await exec(quote(['npx', 'storybook-to-ghpages', '--script', 'build', ...process.argv.slice(2)]), {
    NODE_OPTIONS: '--openssl-legacy-provider' // Storybook needs this for use with node 18; resolved in storybook v7
  });
}

await main();
