// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { copyFile, rm, rename } from 'fs/promises';
import path from 'path';
import { REPO_ROOT } from '../lib/constants.mjs';
import { exec, exec_output } from "../lib/exec.mjs";
import { CHANGE_DIR, CHANGE_DIR_BETA, CHANGE_DIR_STABLE_TEMP } from './constants.mjs';
import { generateChangelogs } from './changelog.mjs';

async function main() {
    const args = process.argv;
    const buildFlavor = args[2];
    if (buildFlavor !== 'stable' && buildFlavor !== 'beta') {
        console.error(`Usage: ${args[0]} ${args[1]} <beta|stable>`);
        throw new Error(`Unknown build flavor ${buildFlavor}`);
    }

    await ensureCleanWorkingDirectory();

    const changelogs = await listTargetChangelogs(buildFlavor);
    console.log('Will update the following CHANGELOGs:');
    changelogs.forEach(({ target }) => {
        console.log(`  ${target}`);
    });

    try {
        if (buildFlavor === 'beta') {
            await swapInBetaChangeFiles();
        }
        await createTemporaryChangelogs(changelogs);
        await generateChangelogs();
        if (buildFlavor === 'beta') {
            await restoreStableChangeFiles();
        }
        await commitChangelogs(changelogs);
    } finally {
        await restoreWorkingDirectory()
    }
}

async function swapInBetaChangeFiles() {
    await rename(CHANGE_DIR, CHANGE_DIR_STABLE_TEMP);
    await rename(CHANGE_DIR_BETA, CHANGE_DIR);
}

async function restoreStableChangeFiles() {
    await rename(CHANGE_DIR_STABLE_TEMP, CHANGE_DIR);
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

async function restoreWorkingDirectory() {
    // Delete swapped change files, if any.
    await rm(CHANGE_DIR, { recursive: true, force: true });
    // We started by checking that the working directory was clean.
    // So it is safe to delete any tracked working directory changes
    // as they could only have been introduced by this script.
    await exec(`git checkout -f`);
}

await main();