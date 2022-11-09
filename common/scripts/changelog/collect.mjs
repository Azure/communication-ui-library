// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { copyFile } from 'fs/promises';
import path from 'path';
import { REPO_ROOT } from '../lib/constants.mjs';
import { exec, exec_output } from "../lib/exec.mjs";
import { CHANGE_DIR, CHANGE_DIR_BETA } from './constants.mjs';
import { generateChangelogs } from './changelog.mjs';

async function main() {
    await ensureCleanWorkingDirectory();
    const changelogs = await listTargetChangelogs('stable');

    console.log('Will update the following CHANLOGEs:');
    changelogs.forEach(({ target }) => {
        console.log(`  ${target}`);
    });

    await createTemporaryChangelogs(changelogs);
    await generateChangelogs();
    await commitChangelogs(changelogs);

    // We started by checking that the working directory was clean.
    // So it is safe to delete any tracked working directory changes
    // as they could only have been introduced by this script.
    await cleanWorkingDirectory()
}

async function ensureCleanWorkingDirectory() {
    try {
        await exec('git diff --name-status --exit-code');
        await exec('git diff --name-status --exit-code --cached');
    } catch (e) {
        throw new Error(`Detected dirty working directory: ${e}`);
    }
}

async function listTargetChangelogs(buildFlavor) {
    const stdout = await exec_output(`git ls-files **/CHANGELOG.${buildFlavor}.md`);
    const subpaths = stdout.split('\n').filter(p => !!p.trim());
    const paths = subpaths.map(p => path.join(REPO_ROOT, p));
    return paths.map(target => ({
        target: target,
        temporaryFile: target.replace(`CHANGELOG.${buildFlavor}.md`, 'CHANGELOG.md')
    }));
}

async function createTemporaryChangelogs(changelogs) {
    console.log('Copying CHANGELOGs to temporary files...');
    await Promise.all(changelogs.map(({ target, temporaryFile }) => {
        return copyFile(target, temporaryFile);
    }));
}

async function commitChangelogs(changelogs) {
    console.log('Copying back updated CHANGELOGS...');
    await Promise.all(changelogs.map(({ target, temporaryFile }) => {
        return copyFile(temporaryFile, target);
    }));
    await exec(`git add ${changelogs.map(({ target }) => target).join(' ')}`);
    await exec(`git add **/CHANGELOG.json`);
    await exec(`git add ${CHANGE_DIR} ${CHANGE_DIR_BETA}`);
    await exec('git commit -m "Collect CHANGELOGs"');
}

async function cleanWorkingDirectory() {
    await exec(`git checkout -f`);
}

await main();