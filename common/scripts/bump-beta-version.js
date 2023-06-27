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
  const [major, minor] = versionStrs[0].split('.');
  const betaVersion = versionStrs[1];
  
  // If there is no beta version then we simply append '-beta.0'
  if (betaVersion === undefined) {
    return [versionStrs, 0].join('-beta.');
  }

  const newBeta = Number.parseInt(betaVersion) + 1;
  // We will bump the minor version when we create a beta on top of a stable one
  const newMinor = Number.parseInt(betaVersion) === 0 ? Number.parseInt(minor) + 1 : minor;

  return [[major, newMinor, 0].join('.'), `${newBeta}`].join('-beta.');
}

main();