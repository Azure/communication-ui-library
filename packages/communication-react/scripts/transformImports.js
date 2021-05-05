// © Microsoft Corporation. All rights reserved.

const fs = require('fs');
const path = require('path');
const packageTranslations = require('./packageTranslations');

/**
 * Transform any matching import and require lines to the mapping provided in packageTranslations.js
 * @param {fs.PathLike} file - file to transform the imports of
 * @param {number} dirLevel - directory level, this indicates the number of ../ to be prepended
 */
function transformFileImports(file, dirLevel) {
  const backTravel = '../'.repeat(dirLevel);

  const fileContent = fs.readFileSync(file, 'UTF-8');
  let changeOccured = false;
  let newContent = '';
  for (let line of fileContent.split(/\n/)) {
    if (line.startsWith('import ') || line.includes('require(')) {
      for (const packageBaseName of Object.keys(packageTranslations)) {
        if (line.includes(packageBaseName)) {
          line = line.replaceAll(packageBaseName, backTravel + packageTranslations[packageBaseName]);
          changeOccured = true;
        }
      }
    }
    newContent += line + '\n';
  }

  // if an import transform happened, write the contents back to the file
  if (changeOccured) {
    fs.writeFileSync(file, newContent);
  }
}

/**
 * Recurse through all directories and call transformFileImports on all files
 * @param {fs.PathLike} folder - folder to recurse through
 * @param {number} dirLevel - directory distance relative to the initial recursion directory level
 */
function recurseThroughFolder(folder, dirLevel) {
  // increment directory level or initialize to 0
  dirLevel = typeof dirLevel !== 'undefined' ? dirLevel + 1 : 0;

  const dirContents = fs.readdirSync(folder, { withFileTypes: true });

  // recursively perform translate on sub dirs
  dirContents
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => recurseThroughFolder(path.resolve(folder, dirent.name), dirLevel));

  // transform each file's import lines
  dirContents
    .filter((dirent) => dirent.isFile())
    .forEach((dirent) => transformFileImports(path.resolve(folder, dirent.name), dirLevel));
}

/**
 * Transform the imports of all esm and cjs build files.
 * The transform maps are listed in packageTranslations.js
 */
function transformImports() {
  const buildFolder = path.resolve(__dirname, '..', 'dist');
  const esmFolder = path.resolve(buildFolder, 'dist-esm');
  const cjsFolder = path.resolve(buildFolder, 'dist-cjs');

  if (!fs.existsSync(esmFolder)) throw `ESM build folder not found at ${esmFolder}`;
  if (!fs.existsSync(cjsFolder)) throw `CJS build folder not found at ${cjsFolder}`;

  recurseThroughFolder(esmFolder);
  recurseThroughFolder(cjsFolder);
}

transformImports();
