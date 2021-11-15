// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Verify the 'types' field is correct in the package.json based on the supplied release type parameter.
 *
 * @command verify - this is the default. This checks the field is correct.
 * @command update - this can be used to update the field to the correct string.
 *
 * @param releaseCandidate - this must be 'public', 'beta' or 'alpha'.
 *
 * @examples
 *   > node .\verifyTypeTrimmedDeclaration.js verify --rc public
 *   > node .\verifyTypeTrimmedDeclaration.js verify --rc beta
 *   > node .\verifyTypeTrimmedDeclaration.js update --rc public
 *
 * @remarks
 * Passing the following parameters should result in the following checks:
 *   * 'public' - "types": "dist/<package.name>-public.d.ts"
 *   * 'beta' - "types": "dist/<package.name>-beta.d.ts"
 *   * 'alpha' - "types": "dist/<package.name>-untrimmed.d.ts"
 */

const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const yargs = require('yargs');

// Hard code constant values. These would need dynamically fetched from the package.json if
// this is used outside of this package.
const TYPES_FIELD_PREFIX = 'dist/communication-react';
const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');

function loadPackageJson(filepath) {
  const packageData = require(filepath);
  if (!packageData) {
    console.error('Unable to load package.json at ', filepath);
    exit(1);
  }
  return packageData;
}

function createCorrectTypeString(releaseCandidate) {
  // Add correct suffix based on release candidate
  switch (releaseCandidate) {
    case 'public':
      return TYPES_FIELD_PREFIX + '-public.d.ts';
    case 'beta':
      return TYPES_FIELD_PREFIX + '-beta.d.ts';
    case 'alpha':
      return TYPES_FIELD_PREFIX + '-untrimmed.d.ts';
    default:
      console.error(
        'Unknown release candidate: ',
        releaseCandidate,
        '. Release Candidate should be "public", "beta" or "alpha".'
      );
      exit(1);
  }
}

function rewriteTypesField(packageData, releaseCandidate) {
  const str = createCorrectTypeString(releaseCandidate);
  packageData['types'] = str;
}

function verifyPackageJsonTypeField(packageData, releaseCandidate) {
  const str = createCorrectTypeString(releaseCandidate);
  if (packageData['types'] !== str) {
    console.error('❌ Error: package.json types field incorrect');
    console.error('❌ Expected: ', str);
    console.error('❌ Received: ', packageData['types']);
    exit(1);
  }
}

function outputNewData(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function verify(argv) {
  console.log('Verifying package.json types field');
  const packageData = loadPackageJson(PACKAGE_JSON_PATH);
  verifyPackageJsonTypeField(packageData, argv.releaseCandidate);
  console.log('✅ Verification successful');
}

function update(argv) {
  console.log('Updating package.json types field');
  const packageData = loadPackageJson(PACKAGE_JSON_PATH);
  rewriteTypesField(packageData, argv.releaseCandidate);
  outputNewData(PACKAGE_JSON_PATH, packageData);
  console.log('✅ Update successful');
}

yargs
  .command({ command: 'verify', description: 'Verify the types field is correct', handler: (argv) => verify(argv) })
  .command({
    command: 'update',
    description: 'Update the types field to the correct string',
    handler: (argv) => update(argv)
  })
  .demandCommand(1, 1, 'You must specify "verify" or "update"', 'You may only specify "verify" or "update"')
  .option('releaseCandidate', {
    alias: 'rc',
    description: 'Release candidate to update the types field for',
    type: 'string',
    demandOption: true
  }).argv;

exit(0);
