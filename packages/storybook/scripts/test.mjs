#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec, getExtraEnv } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    console.log('Skipping storybook test for stable build');
    return;
  }
  await exec('rushx test:snippets');
  await exec(quote(['npx', 'jest', ...process.argv.slice(2)]), await getExtraEnv());
}

await main();
