// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Verify package contains all the dependencies of downstream packlets.
 */

const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const tsConfig = require(path.resolve(__dirname, '../tsconfig.json'));
const downstreamPacklets = tsConfig['compilerOptions']['paths'];

let allDependencies = new Set();
let allPeerDependencies = new Set();

for (const packlet of Object.keys(downstreamPacklets)) {
  // Special case for @internal/northstar-wrapper, we use a bundled output for this packlet
  // and so it does not have a package.json nor dependencies (relevant dependencies are bundled)
  if (packlet === '@internal/northstar-wrapper') {
    continue;
  }

  const packageJsonRelativePath = '../';

  const packletPackageData = require(path.resolve(
    __dirname,
    downstreamPacklets[packlet][0],
    packageJsonRelativePath,
    'package.json'
  ));
  allDependencies = new Set([...allDependencies, ...Object.keys(packletPackageData['dependencies'] || [])]);
  allPeerDependencies = new Set([...allPeerDependencies, ...Object.keys(packletPackageData['peerDependencies'] || [])]);
}

if (allDependencies.size === 0) {
  console.error('VERIFY DEPENDENCIES ERROR: No Dependencies found - something went wrong');
  exit(1);
}
if (allPeerDependencies.size === 0) {
  console.error('VERIFY DEPENDENCIES ERROR: No Peer Dependencies found - something went wrong');
  exit(1);
}

const packageData = require(path.resolve(__dirname, '../package.json'));
const currentPackageDependencies = packageData['dependencies'];
for (const dep of allDependencies) {
  // if the dependency is not listed or is not another internal packlet, throw error
  if (!currentPackageDependencies[dep] && !downstreamPacklets[dep]) {
    console.error(
      `VERIFY DEPENDENCIES ERROR: ${dep} does not exist in @azure/communication-react package dependencies list`
    );
    exit(1);
  }
}

const currentPackagePeerDependencies = packageData['peerDependencies'];
for (const peerDep of allPeerDependencies) {
  if (!currentPackagePeerDependencies[peerDep])
    throw `VERIFY DEPENDENCIES ERROR: ${peerDep} does not exist in @azure/communication-react peerDependencies list`;
}

exit(0);
