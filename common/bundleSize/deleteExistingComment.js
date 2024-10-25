// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Script to check whether the bundle size for each app is greater than the significant change threshold.
 *
 * This script is only useful in the context of PR validation.
 *
 * Usage:
 *   node common/scripts/bundleSize/bundleSizeCheck.mjs <AppName> <BundleSizeDiff>
 */

async function main() {
  const [comment_id, owner, repo] = parseArgs(process.argv);

  if (comment_id) {
    await github.rest.issues.deleteComment({
      owner: owner,
      repo: repo,
      comment_id: comment_id
    });
    console.log(`Bundle size comment ${comment_id} is deleted.`);
  }
}

function parseArgs(args) {
  const comment_id = args[2];
  const owner = args[3];
  const repo = args[4];

  if (!comment_id) {
    throw new Error('No existing comment found');
  }
  if (!owner) {
    throw new Error('No repo owner provided');
  }
  if (!repo) {
    throw new Error('No repo name provided');
  }
  return [comment_id, owner, repo];
}

await main();
