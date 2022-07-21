#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';

function main() {
  if (getBuildFlavor() === 'stable') {
    console.warn('Skipping storybook build for stable build');
    return;
  }
  exec('npx build-storybook  --quiet --loglevel warn');
}

main();
