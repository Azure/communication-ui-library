const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const bumpType = process.argv[2];

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  if (!['major', 'minor', 'patch', 'beta', 'beta-next'].includes(bumpType)) {
    throw '\nplease add either major/minor/patch/beta as a parameter!\n\n  Syntax:\n  node bump-beta-release-version.js minor\n'
  }
  updateAllVersions(bumpBetaVersion);
  // Need to update all internal project dependencies using the same rule
  updateAllDepVersions(bumpBetaVersion, depNames);
}

// https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/43834/How-to-determine-the-next-web-UI-Library-package-version.
const bumpBetaVersion = (currentVersion) => {
  const versionStrs = currentVersion.split('-beta.');
  const [major, minor, patch] = versionStrs[0].split('.');

  if (bumpType === 'beta') {
    const betaVersion = versionStrs[1];
    // if bumpType is beta, no need to update major, minor or patch version
    if (betaVersion === undefined) {
      // set beta version to 0 to fix beachball issue with prerelease type
      const newPatch = Number.parseInt(patch) + 1;
      return `${major}.${minor}.${newPatch}-beta.0`
    }
    const newBeta = Number.parseInt(betaVersion) + 1;
    return `${major}.${minor}.${patch}-beta.${newBeta}`
  } else if (bumpType === 'beta-next') {
    // if bumpType is stable we want to reset the beta version
    const newMinor = Number.parseInt(minor) + 1;
    // patch version goes to 0 since we are bumping the next beta version's minor and we want to
    // reset the patch version to 0
    return `${major}.${newMinor}.${0}-beta.0`;
  } else {
    const newMajor = bumpType === 'major' ? Number.parseInt(major) + 1 : major;
    const newMinor = bumpType === 'major' ?
      0
      : bumpType === 'minor' ? Number.parseInt(minor) + 1 : minor;
    const newPatch = bumpType === 'major' || bumpType === 'minor' ?
      0
      : bumpType === 'patch' ? Number.parseInt(patch) + 1 : patch;
    
    return `${newMajor}.${newMinor}.${newPatch}-beta.1`
  }
}

main();