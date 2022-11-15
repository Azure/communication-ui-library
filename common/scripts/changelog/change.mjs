// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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

import { BEACHBALL, CHANGE_DIR, CHANGE_DIR_BETA } from './constants.mjs';
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
        ...args
    ];
    await exec(cmd.join(' '));
    await duplicateChangeFiles();
}

async function duplicateChangeFiles() {
    const gitLogStdout = await exec_output(`git log -1 --name-status`);
    const newChangeFiles = parseNewChangeFiles(gitLogStdout);
    if (newChangeFiles.length === 0) {
        return;
    }

    console.log(`Duplicating ${newChangeFiles.length} change files into ${CHANGE_DIR_BETA}`);
    for (const file of newChangeFiles) {
        fs.copyFileSync(path.join(CHANGE_DIR, file), path.join(CHANGE_DIR_BETA, file));
    }
    await exec(`git add ${CHANGE_DIR_BETA}`);
    await exec(`git commit -m 'Duplicate change files for beta release'`);
}

await main();