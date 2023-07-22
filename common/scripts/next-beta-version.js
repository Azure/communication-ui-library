const semver = require('semver');

function nextBetaVersion(currentVersion, minor) {
  let nextBetaVersion = currentVersion;

  if (minor) {
    nextBetaVersion = semver.inc(currentVersion, 'preminor', 'beta', '1' /*beta build number base*/ );
  } else {
    nextBetaVersion = semver.inc(currentVersion, 'prepatch', 'beta', '1' /*beta build number base*/ );
  }

  // If the current version has a beta build number like 3 in '1.0.0-beta.3' then we increment it and use it as
  // the beta build for the next beta version.
  const currentBetaBuildNumber = Number.parseInt(currentVersion.split('-beta.')[1]);
  if (currentBetaBuildNumber) {
    nextBetaVersion = nextBetaVersion.split('-beta.')[0];
    nextBetaVersion = `${nextBetaVersion}-beta.${currentBetaBuildNumber + 1}`;
  }

  return nextBetaVersion;
}

module.exports = nextBetaVersion;