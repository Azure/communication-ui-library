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

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

type BuildFolderRoots = Array<string>;
type PackageTransforms = Record<string, string>;
type TransformImportConfig = {
  buildFolderRoots: BuildFolderRoots;
  packageTranslations: PackageTransforms;
};
export type Logger = {
  error: (...data: any[]) => void;
  debug: (...data: any[]) => void;
  info: (...data: any[]) => void;
};
type Bookkeeping = {
  linesChangedCount: number;
  filesChangedCount: number;
  filesSearchedCount: number;
};

/**
 * Transform any matching import and require lines to the mapping provided in packageTranslations.js
 * @param file - file to transform the imports of
 * @param dirLevel - directory level, this indicates the number of ../ to be prepended
 */
export function transformFileImports(
  file: fs.PathLike,
  packageTranslations: PackageTransforms,
  dirLevel: number,
  logger: Logger,
  bookkeeping?: Bookkeeping
): void {
  logger.debug(`File found (dirLevel: ${dirLevel})`, file);
  const backTravel = '../'.repeat(dirLevel);

  const fileContent = fs.readFileSync(file, 'utf-8');
  let changeOccurred = false;
  let newContent = '';
  for (let line of fileContent.split(/\n/)) {
    if (line.includes(' from ') || line.includes('require(')) {
      for (const packageBaseName of Object.keys(packageTranslations)) {
        if (line.includes(packageBaseName)) {
          const newImport = backTravel + packageTranslations[packageBaseName];
          logger.debug(`Replacing ${packageBaseName} in ${line} with ${newImport}`);
          line = line.replace(packageBaseName, newImport);
          changeOccurred = true;
          bookkeeping && bookkeeping.linesChangedCount++;
        }
      }
    }
    newContent += line + '\n';
  }

  // if an import transform happened, write the contents back to the file
  if (changeOccurred) {
    bookkeeping && bookkeeping.filesChangedCount++;
    fs.writeFileSync(file, newContent);
  }
}

/**
 * Recurse through all directories and call transformFileImports on all files
 * @param folder - folder to recurse through
 * @param dirLevel - directory distance relative to the initial recursion directory level
 */
function recurseThroughFolder(
  folder: string,
  packageTranslations: PackageTransforms,
  dirLevel: number,
  logger: Logger,
  bookkeeping?: Bookkeeping
): void {
  logger.debug(`Searching folder (dirLevel: ${dirLevel})`, folder);

  const dirContents = fs.readdirSync(folder, { withFileTypes: true });

  // transform each file's import lines
  dirContents
    .filter((dirent) => dirent.isFile())
    .forEach((dirent) => {
      bookkeeping && bookkeeping.filesSearchedCount++;
      transformFileImports(path.resolve(folder, dirent.name), packageTranslations, dirLevel, logger, bookkeeping);
    });

  // recursively perform translate on sub dirs
  dirContents
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) =>
      recurseThroughFolder(path.resolve(folder, dirent.name), packageTranslations, ++dirLevel, logger, bookkeeping)
    );
}

/**
 * Transform the imports of all esm and cjs build files.
 * The transform maps are listed in packageTranslations.js
 * @param config - config file, see readme for options and format
 */
function transformImports(config: TransformImportConfig, logger: Logger, bookkeeping?: Bookkeeping): void {
  for (const folder of config.buildFolderRoots) {
    const folderPath = path.resolve(process.cwd(), folder);
    logger.debug(`Folder:`, folderPath);
    if (!fs.existsSync(folderPath)) {
      logger.error(`❌ ERROR: folder not found at ${folderPath}`);
      exit(1);
    }
    recurseThroughFolder(folderPath, config.packageTranslations, 0, logger, bookkeeping);
  }
}

function getConfig(logger: Logger): TransformImportConfig {
  const configPath = path.resolve(process.cwd(), 'importTransform.config.js');
  if (!fs.existsSync(configPath)) {
    logger.error(`❌ ERROR: config not found at ${configPath}`);
    exit(1);
  }

  const config = require(configPath);
  logger.info('✅ config successfully loaded from:', configPath);

  if (!config.buildFolderRoots || !(config.buildFolderRoots.length > 0)) {
    logger.error(`❌ ERROR: Invalid/missing buildFolderRoots in config`);
    exit(1);
  }

  if (!config.packageTranslations || !(Object.keys(config.packageTranslations).length > 0)) {
    logger.error(`❌ ERROR: Invalid/missing packageTranslations in config`);
    exit(1);
  }

  logger.debug('✅ config options verified');
  return config;
}

export function main(customLogger?: Logger): void {
  const logger = customLogger ?? console;
  logger.info('Transforming imports...');

  const bookkeeping: Bookkeeping = {
    linesChangedCount: 0,
    filesChangedCount: 0,
    filesSearchedCount: 0
  };

  const config = getConfig(logger);
  transformImports(config, logger, bookkeeping);

  logger.info(
    `✅ Complete.
      Files Searched: ${bookkeeping.filesSearchedCount}.
      Files changed: ${bookkeeping.filesChangedCount}.
      Lines changed ${bookkeeping.linesChangedCount}.`
  );
}
