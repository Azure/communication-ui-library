const { updateAllDepVersions } = require('./package-utils');
const sdkDeps = ["@azure/communication-calling", "@azure/communication-chat"] 
const main = () => {
  updateAllDepVersions(chooseBetaVersion, sdkDeps);
}

const chooseBetaVersion = (semver) => {
  const versions = semver.split('||').map(version => version.trim());
  if(versions.length === 1) {
    return semver;
  } 
  for(const version of versions) {
    if(version.includes('beta')) return version;
  }
  throw 'can\'t find the right version for beta!';
} 

main();