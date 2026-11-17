// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { exec } from './lib/exec.mjs';

const flavor = process.env.COMMUNICATION_REACT_FLAVOR;

// Rush's nested cmd.exe invocation cannot reliably preserve grouped shell conditionals.
if (flavor === 'stable' || flavor === 'beta-release') {
  await exec('rushx preprocess');
} else if (flavor === 'beta') {
  console.log('skip preprocess');
} else {
  throw new Error(`Unsupported test flavor: ${flavor}`);
}
