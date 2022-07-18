const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  updateAllVersions(bumpBetaVersion);
}

const bumpBetaVersion = (currentVersion) => {
  const versionStrs = currentVersion.split('-beta.');
  const newBeta = versionStrs[1] === undefined ? 0 : Number.parseInt(versionStrs[1]) + 1;
  const [major, minor, patch] = versionStrs[0].split('.');
  const newPatch = Number.parseInt(patch) + 1;

  // We will bump the patch version when create a beta on top of a stable one
  return [[major, minor, newBeta === 0 ? newPatch : patch].join('.'), `${newBeta}`].join('-beta.');
}

main();