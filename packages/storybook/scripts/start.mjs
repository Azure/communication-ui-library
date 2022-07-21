#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBuildFlavor, exec } from './common.mjs';

function main() {
  if (getBuildFlavor() === 'stable') {
    throw new Error(
      'Can not start storybook in stable flavor environment. Please run `rush switch-flavor:beta` first.'
    );
  }
  exec('npx start-storybook -p 6006 --no-manager-cache --quiet --loglevel warn');
}

main();
