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

import { exec_output } from "../lib/exec.mjs";
import { parseNewChangeFiles } from "./utils.mjs";
import { CHANGE_DIR_BETA, CHANGE_DIR_STABLE } from "./constants.mjs";

async function main() {
  const [base, head] = parseArgs(process.argv);
  const gitLogStdoutStableChangeFiles = await exec_output(`git log --name-status ${base}..${head} -- ${CHANGE_DIR_STABLE}`);
  const gitLogStdoutBetaChangeFiles = await exec_output(`git log --name-status ${base}..${head} -- ${CHANGE_DIR_BETA}`);

  const newStableChangeFiles = parseNewChangeFiles(gitLogStdoutStableChangeFiles);
  const newBetaChangeFiles = parseNewChangeFiles(gitLogStdoutBetaChangeFiles);
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