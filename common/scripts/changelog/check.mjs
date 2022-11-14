// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Script to check that changefile has been generated for each Pull Request.
 *
 * This script is only useful in the context of PR validation.
 *
 * Usage:
 *   node common/scripts/changelog/check.mjs origin/main origin/feature-pony
 */

import { REPO_ROOT } from "../lib/constants.mjs";
import { exec_output } from "../lib/exec.mjs";
import path from 'path';
import { parseNewChangeFiles } from "./utils.mjs";

async function main() {
  const [base, head] = parseArgs(process.argv);
  const gitLogStdout = await exec_output(`git log --name-status ${base}..${head} -- ${path.join(REPO_ROOT, 'change/')}`);
  const newChangeFiles = parseNewChangeFiles(gitLogStdout);
  if (!newChangeFiles?.length) {
    console.error('No changefile detected! Please run `rush changelog` to document your change.');
    process.exit(1);
  }
  console.log(`Found ${newChangeFiles.length} changefiles. All is good!`)
}

function parseArgs(args) {
  const base = args[2];
  const head = args[3];
  if (!base) {
    printUsage(args);
    throw new Error('No base ref provided');
  }
  if (!head) {
    printUsage(args);
    throw new Error('No head ref provided');
  }
  return [base, head];
}

function printUsage(args) {
  console.error(`Usage: ${args[0]} ${args[1]} <base-ref> <head-ref>`);
}

await main();