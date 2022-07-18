const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  updateAllVersions(removeBetaSuffix);
}

const removeBetaSuffix = (currentVersion) => {
  return currentVersion.split('-beta')[0];
}

main();