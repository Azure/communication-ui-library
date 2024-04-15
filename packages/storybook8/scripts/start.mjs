#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not start storybook in stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  await exec(quote(['npx', 'storybook', 'dev', '-p', '6006', '--quiet', '--loglevel', 'warn']));
}

await main();
