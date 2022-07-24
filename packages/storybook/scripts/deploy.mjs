#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';
import { quote } from 'shell-quote';

function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not deploy storybook from stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  exec(quote(['npx', 'storybook-to-ghpages', '--script', 'build', ...process.argv.slice(2)]));
}

main();
