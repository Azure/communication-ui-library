#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not deploy storybook from stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  await exec(quote(['npx', 'storybook-to-ghpages', '--script', 'build', ...process.argv.slice(2)]));
}

await main();
