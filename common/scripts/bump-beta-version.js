const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  updateAllVersions(bumpBetaVersion);
  // Need to update all internal project dependencies using the same rule
  updateAllDepVersions(bumpBetaVersion, depNames);
}

const bumpBetaVersion = (currentVersion) => {
  const versionStrs = currentVersion.split('-beta.');
  const currentBeta = versionStrs[1] ? Number.parseInt(versionStrs[1]) : 0;
  const [major, minor, patch] = versionStrs[0].split('.');

  // We will bump the patch version when create a beta on top of a stable one
  return [[major, minor, currentBeta === 0? Number.parseInt(patch) + 1 : patch].join('.'), `${currentBeta + 1}`].join('-beta.');
}

main();