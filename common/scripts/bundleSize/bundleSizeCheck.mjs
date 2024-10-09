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
  const significantBundleSizeThreshold = 800;
  const [app, bundleSizeDiff] = parseArgs(process.argv);

  if (bundleSizeDiff >= significantBundleSizeThreshold) {
    console.error(`The bundle size diff for ${app} is greater than the threshold of ${significantBundleSizeThreshold}! If the bundle size increase is intended, please add \`significant bundle size change\` label to the PR.`);
    process.exit(1);
  }
  console.log(`Bundle size diff for ${app} is below the threshold of ${significantBundleSizeThreshold}. All is good!`)
}

function parseArgs(args) {
  const app = args[2];
  const bundleSizeDiff = args[3];
  if (!app) {
    throw new Error('No app name provided');
  }
  if (!bundleSizeDiff) {
    throw new Error('No bundle size diff provided');
  }
  return [app, bundleSizeDiff];
}

await main();
