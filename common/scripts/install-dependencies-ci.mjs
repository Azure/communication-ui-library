#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

///
/// This script is used to run install dependency commands in CI.
/// `yml` files are not good at reusing commands, so this script helps us to write-once and reuse.
///

import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main(args) {
  const flavor = args[2];
  if (!flavor) {
    throw new Error('Usage: node install-dependencies-ci.mjs <flavor>');
  }

  // Install rush based on the version in rush.json.
  // If we do not install that specific version, the first rush command has to reinstall rush.
  const rushVersion = JSON.parse(fs.readFileSync(resolve(__dirname, '../../rush.json'))).rushVersion;
  execSync(`npm install -g @microsoft/rush@${rushVersion}`);

  // Force build flavor. This is necessary in CI to catch downstream dependency issues.
  // For example, we had an issue where our stable flavor was not catching that the
  // `@azure/communication-calling-effects` package should've only be installed in beta flavor
  // and was failing to error out in stable flavor.
  execSync(`node ./common/scripts/force-build-flavor.mjs ${flavor}`);

  // Finally, install node module dependencies based on the flavor.
  execSync(`rush switch-flavor:${flavor}`);
}

main(process.argv);
