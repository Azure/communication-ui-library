// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from 'fs';
import path from 'path';

import { BEACHBALL, CHANGE_DIR, CHANGE_DIR_BETA } from './constants.mjs';
import { exec, exec_output } from '../lib/index.mjs';

const NEW_CHANGE_FILE_REGEXP = /\s*A\s*change\/(.*\.json)\s*/;

async function main() {
    await exec(`node ${BEACHBALL} -p @internal/storybook`);
    await duplicateChangeFiles();
}

async function duplicateChangeFiles() {
    const gitLogStdout = await exec_output(`git log -1 --name-status`);
    const newChangeFiles = parseNewChangeFiles(gitLogStdout);
    if (newChangeFiles.length === 0) {
        return;
    }

    console.log(`Duplicating ${newChangeFiles.length} change files into ${CHANGE_DIR_BETA}`);
    ensureDirectory(CHANGE_DIR_BETA);
    for (const file of newChangeFiles) {
        fs.copyFileSync(path.join(CHANGE_DIR, file), path.join(CHANGE_DIR_BETA, file));
    }
    await exec(`git add ${CHANGE_DIR_BETA}`);
    await exec(`git commit -m 'Duplicate change files for beta release'`);
}

function parseNewChangeFiles(stdout) {
    const lines = stdout.split('\n');
    const matches = lines.map(line => line.match(NEW_CHANGE_FILE_REGEXP)).filter(match => !!match);
    // Extract the first capture group.
    return matches.map(match => match[1]);
}

function ensureDirectory(path) {
    if (!fs.statSync(path, {throwIfNoEntry: false})) {
        fs.mkdirSync(path);
    }
}

await main();