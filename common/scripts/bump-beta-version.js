const path = require('path');
const nextBetaVersion = require('./next-beta-version');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const bumpType = process.argv[2];

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  updateAllVersions(nextBetaVersion, bumpType === 'minor');
  // Need to update all internal project dependencies using the same rule
  updateAllDepVersions(nextBetaVersion, bumpType === 'minor', depNames);
}

main();