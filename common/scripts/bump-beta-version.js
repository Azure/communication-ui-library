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

// TODO: This needs to be updated. This does not work for all beta release scenarios outlined in documentation
// https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/43834/How-to-determine-the-next-web-UI-Library-package-version.
const bumpBetaVersion = (currentVersion) => {
  const versionStrs = currentVersion.split('-beta.');
  const [major, minor] = versionStrs[0].split('.');
  const betaVersion = versionStrs[1];
  
  const newMinor = Number.parseInt(minor) + 1;

  if (betaVersion === undefined) {
    return `${major}.${newMinor}.0-beta.0`
  }

  const newBeta = Number.parseInt(betaVersion) + 1;
  return `${major}.${newMinor}.0-beta.${newBeta}`
}

main();