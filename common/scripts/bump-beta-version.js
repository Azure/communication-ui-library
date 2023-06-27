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
  const [major, minor, patch] = versionStrs[0].split('.');
  const betaVersion = versionStrs[1];
  
  if (betaVersion === undefined) {
    const newMinor = Number.parseInt(minor) + 1;
    return `${major}.${newMinor}.0-beta.0`
  }

  if (Number.parseInt(betaVersion) === 0) {
    // We will bump the minor version when we create a beta on top of a stable one
    const newMinor = Number.parseInt(minor) + 1;
    const newBeta = Number.parseInt(betaVersion) + 1;
    return `${major}.${newMinor}.0-beta.${newBeta}`
  }

  const newBeta = Number.parseInt(betaVersion) + 1;
  return `${major}.${minor}.${patch}-beta.${newBeta}`
}

main();