// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  const gitLogStdoutStableChangeFiles = await exec_output(`git log --name-status ${base}..${head} -- ${path.join(REPO_ROOT, 'change/')}`);
  const gitLogStdoutBetaChangeFiles = await exec_output(`git log --name-status ${base}..${head} -- ${path.join(REPO_ROOT, 'change-beta/')}`);

  const newStableChangeFiles = parseNewChangeFiles(gitLogStdoutStableChangeFiles);
  console.log(`Found ${newStableChangeFiles?.length ?? 0} new stable changefiles.`);
  const newBetaChangeFiles = parseNewChangeFiles(gitLogStdoutBetaChangeFiles);
  console.log(`Found ${newStableChangeFiles?.length ?? 0} new stable changefiles.`);
  const newChangeFilesCount = (newStableChangeFiles?.length ?? 0) + (newBetaChangeFiles?.length ?? 0);

  if (newChangeFilesCount === 0) {
    console.error('No changefile detected! Please run `rush changelog` to document your change. Or if your changes do not affect the published packages in any way, please add `do not need changelog` label to the PR.');
    process.exit(1);
  }
  console.log(`Found ${newChangeFilesCount} changefiles. All is good!`)
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