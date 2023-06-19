#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

async function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not start storybook in stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  await exec(quote(['npx', 'start-storybook', '-p', '6006', '--no-manager-cache', '--quiet', '--loglevel', 'warn']), {
    NODE_OPTIONS: '--openssl-legacy-provider' // Storybook needs this for use with node 18; resolved in storybook v7
  });
}

await main();
