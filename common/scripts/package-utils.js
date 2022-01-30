const path = require('path');
const fs = require('fs');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');
const SAMPLES_DIR = path.join(__dirname, '..', '..', 'samples');

function findAllPackageJSON(root) {
  return fs.readdirSync(root).map(
    (pkg) => {
      const packageJSON = path.join(root, pkg, 'package.json');
      const stat = fs.lstatSync(packageJSON);
      if (!stat.isFile()) {
        throw new Error(packageJSON + ' does not exist!');
      }
      return packageJSON;
    }
  )
}

function parsePackage(packagePath) {
  return JSON.parse(fs.readFileSync(packagePath));
}

function overrideAllPackages(packagePaths, packageProcessFunc) {
  for (const path of packagePaths) {
    const packageJson = parsePackage(path);
    newPackageJson = packageProcessFunc(packageJson);
    require('fs').writeFileSync(path, JSON.stringify(newPackageJson, null, 2));
  }
}

const updateAllVersions = (versionUpdater) => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);

  const packageProcessFunc = (packageJson) => {
    const result = {
      ...packageJson,
      version: versionUpdater(packageJson.version)
    };
    return result;
  }

  overrideAllPackages(packagePaths, packageProcessFunc);
}

const updateAllDepVersions = (versionUpdater, deps/* dependency names to update version*/) => {
  const packagePaths = [...findAllPackageJSON(PACKAGES_DIR), ...findAllPackageJSON(SAMPLES_DIR)];

  const packageProcessFunc = (packageJson) => {
    const result = { ...packageJson };
    updateDependencies(result.dependencies);
    updateDependencies(result.devDependencies);
    updateDependencies(result.peerDependencies);
    return result;
  }

  const updateDependencies = (dependencies) => {
    for (const depName in dependencies) {
      if (deps.includes(depName)) {
        dependencies[depName] = versionUpdater(dependencies[depName]);
      }
    }
  }

  overrideAllPackages(packagePaths, packageProcessFunc);
}

function getAllNames(packagePaths) {
  return packagePaths.map(path => parsePackage(path).name);
}

module.exports = {
  updateAllVersions,
  updateAllDepVersions,
  findAllPackageJSON,
  getAllNames
}