// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Script to generate change files for changes in this repository.
 *
 * This script is a wrapper for `beachball change`.
 * - The change file is generated only for the publicly released packlet: @azure/communication-react
 * - Seprate change file is created for stable and beta releases
 *
 * Usage:
 *   node common/scripts/changelog/change.mjs
 *   # Or, forward arguments to `beachball change`:
 *   node common/scripts/changelog/change.mjs -t patch -m 'Fix video gallery flicker'
 */

import fs from 'fs';
import path from 'path';

import { BEACHBALL, CHANGE_DIR_STABLE, CHANGE_DIR_BETA } from './constants.mjs';
import { parseNewChangeFiles } from './utils.mjs';
import { exec, exec_output } from '../lib/index.mjs';

async function main() {
    const args = process.argv.slice(2);
    // Warning: We don't have a shellquote available in this script.
    // So a user of this script can use it for arbitrary shell command execution.
    // But if they can run this script, they can already run arbitrary commands.
    // So, meh.
    const cmd = [
        'node',
        BEACHBALL,
        // With `-p`, beachball _always_ generates a changefile.
        // It does not check if there are any changes / any changefiles already exist.
        // This is intentional as it gives the developer the control on when to create changefiles
        // for the entire package (irrespective of which packlet contains the changes).
        '-p', '@azure/communication-react',
        '--no-commit',
        ...args
    ];
    await exec(cmd.join(' '));
    await adjustAndCommitChangeFile();
}

/**
 * Decide if the change file needs to be duplicated, or moved to the change-beta directory.
 * If the change file is of type "prerelease", it is only relevant for beta changelogs, so it is moved to the change-beta directory.
 * If the change file is of type "patch", "minor" or "major", it is duplicated to the change-beta directory as it is relevant for both stable and beta changelogs.
 */
async function adjustAndCommitChangeFile() {
    const stagedGitFiles = await exec_output(`git diff --name-only --cached`);
    const newChangeFilesFilenames = parseNewChangeFiles(stagedGitFiles);
    if (newChangeFilesFilenames.length === 0) {
        throw new Error('No new change files created by Beachball detected.');
    } else if (newChangeFilesFilenames.length > 1) {
        throw new Error(`Expected only one change file, but found ${newChangeFilesFilenames.length} change files`);
    }

    const changeFilename = newChangeFilesFilenames[0];
    const filepath = path.join(CHANGE_DIR_STABLE, changeFilename);
    const changeFile = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    console.log(`Duplicating ${filepath} change files into ${CHANGE_DIR_BETA}`);
    fs.copyFileSync(filepath, path.join(CHANGE_DIR_BETA, changeFilename));
    await exec(`git add ${CHANGE_DIR_BETA}`);

    // if the type is prerelease, we can delete the stable changefile that was created.
    if (changeFile.type === "prerelease") {
        console.log(`Deleting stable change file ${filepath}`);
        fs.unlinkSync(filepath);
        await exec(`git add ${CHANGE_DIR_STABLE}`);
    }

    await exec(`git commit -m 'Change files'`);
}

await main();