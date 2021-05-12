// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// File logic:
//
// ┌─────────────────────────┐
// │                         │
// │         Start           │
// │                         │
// │  (transform imports())  │
// │                         │
// └────────────┬────────────┘
//              │
//              │       ┌────────────────┐
//              ├──────►│                │
//              │       │   GetConfig()  │
//              │◄──────┤                │
//              │       └────────────────┘
//              │
//              ▼
// ┌─────────────────────────┐
// │                         │
// │ RecurseThroughFolders() │◄──┐
// │                         │   │
// └────────────┬────────────┘   │
//              │                │
//              ├──folder-found──┤
//              │                │
//          file│found           │
//              │                │
//              ▼                │
// ┌─────────────────────────┐   │
// │                         │   │
// │  for each line in file  ├───┤
// │                         │   │
// └────────────┬────────────┘   │
//              │                │
//    matching import found      │
//              │                │
//              ▼                │
// ┌─────────────────────────┐   │
// │                         │   │
// │ transform import lines  ├───┘
// │                         │
// └─────────────────────────┘

import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';

type BuildFolderRoots = Array<string>;
type PackageTransforms = Record<string, string>;
type TransformImportConfig = {
  buildFolderRoots: BuildFolderRoots;
  packageTranslations: PackageTransforms;
};

const { argv } = yargs
  .option('v', {
    alias: 'verbose',
    description: 'Run with verbose output enabled',
    type: 'boolean'
  })
  .option('s', {
    alias: 'silent',
    description: 'Run with no output except errors. Note: this has no effect if verbose output is enabled.',
    type: 'boolean'
  });

const { silent, verbose } = argv;
const log = verbose ? console.log : () => {};

// Variables for tracking number of changes
let linesChangedCount: number;
let filesChangedCount: number;
let filesSearchedCount: number;

/**
 * Transform any matching import and require lines to the mapping provided in packageTranslations.js
 * @param file - file to transform the imports of
 * @param dirLevel - directory level, this indicates the number of ../ to be prepended
 */
export function transformFileImports(
  file: fs.PathLike,
  packageTranslations: PackageTransforms,
  dirLevel: number
): void {
  log(`File found (dirLevel: ${dirLevel})`, file);
  const backTravel = '../'.repeat(dirLevel);

  const fileContent = fs.readFileSync(file, 'utf-8');
  let changeOccurred = false;
  let newContent = '';
  for (let line of fileContent.split(/\n/)) {
    if (line.includes(' from ') || line.includes('require(')) {
      for (const packageBaseName of Object.keys(packageTranslations)) {
        if (line.includes(packageBaseName)) {
          const newImport = backTravel + packageTranslations[packageBaseName];
          log(`Replacing ${packageBaseName} in ${line} with ${newImport}`);
          line = line.replace(packageBaseName, newImport);
          changeOccurred = true;
          linesChangedCount++;
        }
      }
    }
    newContent += line + '\n';
  }

  // if an import transform happened, write the contents back to the file
  if (changeOccurred) {
    filesChangedCount++;
    fs.writeFileSync(file, newContent);
  }
}

/**
 * Recurse through all directories and call transformFileImports on all files
 * @param folder - folder to recurse through
 * @param dirLevel - directory distance relative to the initial recursion directory level
 */
function recurseThroughFolder(folder: string, packageTranslations: PackageTransforms, dirLevel: number): void {
  log(`Searching folder (dirLevel: ${dirLevel})`, folder);

  const dirContents = fs.readdirSync(folder, { withFileTypes: true });

  // transform each file's import lines
  dirContents
    .filter((dirent) => dirent.isFile())
    .forEach((dirent) => {
      filesSearchedCount++;
      transformFileImports(path.resolve(folder, dirent.name), packageTranslations, dirLevel);
    });

  // recursively perform translate on sub dirs
  dirContents
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => recurseThroughFolder(path.resolve(folder, dirent.name), packageTranslations, ++dirLevel));
}

/**
 * Transform the imports of all esm and cjs build files.
 * The transform maps are listed in packageTranslations.js
 * @param config - config file, see readme for options and format
 */
function transformImports(config: TransformImportConfig): void {
  for (const folder of config.buildFolderRoots) {
    const folderPath = path.resolve(process.cwd(), folder);
    log(`Folder:`, folderPath);
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ ERROR: folder not found at ${folderPath}`);
      exit(1);
    }
    recurseThroughFolder(folderPath, config.packageTranslations, 0);
  }
}

function getConfig(): TransformImportConfig {
  const configPath = path.resolve(process.cwd(), 'importTransform.config.js');
  if (!fs.existsSync(configPath)) {
    console.error(`❌ ERROR: config not found at ${configPath}`);
    exit(1);
  }

  const config = require(configPath);
  log('✅ config successfully loaded from:', configPath);

  if (!config.buildFolderRoots || !(config.buildFolderRoots.length > 0)) {
    console.error(`❌ ERROR: Invalid/missing buildFolderRoots in config`);
    exit(1);
  }

  if (!config.packageTranslations || !(Object.keys(config.packageTranslations).length > 0)) {
    console.error(`❌ ERROR: Invalid/missing packageTranslations in config`);
    exit(1);
  }

  log('✅ config options verified');
  return config;
}

function resetBookkeeping(): void {
  linesChangedCount = 0;
  filesChangedCount = 0;
  filesSearchedCount = 0;
}

export function main(): void {
  if (!silent || verbose) {
    console.log('Transforming imports...');
  }
  resetBookkeeping();

  transformImports(getConfig());

  if (!silent || verbose) {
    console.log(
      `✅ complete. Files Searched: ${filesSearchedCount}. Files changed: ${filesChangedCount}. Lines changed ${linesChangedCount}.`
    );
  }
}
