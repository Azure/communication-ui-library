// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Script to collect CHANGELOG files for stable and beta releases.
 *
 * This script processes the change files generated previously via the ./change.mjs.
 * It collects the changes into the CHANGELOG relevant for the release type.
 *
 * Usage:
 *   node common/scripts/changelog/collect.mjs stable
 *   node common/scripts/changelog/collect.mjs beta
 */

import { copyFile, open, rm, readFile, writeFile } from 'fs/promises';
import { exec } from "../lib/exec.mjs";
import { CHANGE_DIR_STABLE, CHANGE_DIR_BETA, COMMUNICATION_REACT_CHANGELOG_BETA, COMMUNICATION_REACT_CHANGELOG_STABLE, COMMUNICATION_REACT_CHANGELOG_TEMPORARY } from './constants.mjs';
import { generateChangelogs } from './changelog.mjs';

async function main() {
    const args = process.argv;
    const buildFlavor = args[2];

    await ensureCleanWorkingDirectory();
    try {
        if (buildFlavor === 'beta') {
            await collectionBetaChangelog();
        } else if (buildFlavor === 'stable') {
            await collectionStableChangelog();
        } else {
            console.error(`Usage: ${args[0]} ${args[1]} <beta|stable>`);
            throw new Error(`Unknown build flavor ${buildFlavor}`);
        }
    } finally {
        await restoreWorkingDirectory()
    }
}

async function collectionBetaChangelog() {
    await createTemporaryChangelog(COMMUNICATION_REACT_CHANGELOG_BETA);
    await generateChangelogs('beta-release');
    const prsFromStableChangelog = await getPRsFromFile(COMMUNICATION_REACT_CHANGELOG_STABLE);
    await removePRsFromLatestReleaseOfChangelogFile(COMMUNICATION_REACT_CHANGELOG_TEMPORARY, prsFromStableChangelog);
    await commitChangelog(COMMUNICATION_REACT_CHANGELOG_BETA);
}

async function collectionStableChangelog() {
    await createTemporaryChangelog(COMMUNICATION_REACT_CHANGELOG_STABLE);
    await generateChangelogs('stable');
    await commitChangelog(COMMUNICATION_REACT_CHANGELOG_STABLE);
}

async function ensureCleanWorkingDirectory() {
    try {
        await exec('git diff --name-status --exit-code');
        await exec('git diff --name-status --exit-code --cached');
    } catch (e) {
        throw new Error(`Detected dirty working directory: ${e}`);
    }
}

async function createTemporaryChangelog(target) {
    await rm(COMMUNICATION_REACT_CHANGELOG_TEMPORARY, { force: true })
    await copyFile(target, COMMUNICATION_REACT_CHANGELOG_TEMPORARY);
}

async function commitChangelog(target) {
    await copyFile(COMMUNICATION_REACT_CHANGELOG_TEMPORARY, target);
    await exec(`git add ${target}`);
    await exec(`git add **/CHANGELOG.json`);
    await exec(`git add ${CHANGE_DIR_STABLE} ${CHANGE_DIR_BETA}`);
    await exec('git commit -m "Collect CHANGELOG"');
}

async function restoreWorkingDirectory() {
    // We started by checking that the working directory was clean.
    // So it is safe to delete any tracked working directory changes
    // as they could only have been introduced by this script.
    await exec(`git checkout -f`);
}

async function getPRsFromFile(targetFile) {
    const changelog = await readFile(targetFile, 'utf-8');
    // Regular expression to capture PRs. For example, '[PR #3621]' will be captured from string
    // '- Update styles of configuration page to match specification ([PR #3621](https://github.com/azure/communication-ui-library/pull/3621) by 12345678+someonet@users.noreply.github.com)'
    const prRegex = /(\[PR\s#[0-9]+\])/g;
    const prs = [...changelog.matchAll(prRegex)].map((match)=>match[0]);
    return new Set(prs);
}

async function removePRsFromLatestReleaseOfChangelogFile(targetFile, setOfPRsToRemove) {
    const file = await open(targetFile);
    // Regular expression to capture PRs. For example, '[PR #3621]' will be captured from string
    // '- Update styles of configuration page to match specification ([PR #3621](https://github.com/azure/communication-ui-library/pull/3621) by 12345678+someonet@users.noreply.github.com)'
    const prRegex = /(\[PR\s#[0-9]+\])/;
    // Regular expression to match release headers. For example, '## [1.9.0-beta.1]' will be matched from string
    // '## [1.9.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.9.0-beta.1)'
    const releaseHeadingRegex = /^##\s[[0-9]+\.[[0-9]+\.[[0-9]+(-beta.[[0-9]+)?]/;
    let dedupedChangelog = "";
    let releaseHeadingsCount = 0;
    for await (const line of file.readLines()) {
        if (line.match(releaseHeadingRegex)) {
            releaseHeadingsCount++;
        }
        const prsFromLine = Array.from(new Set(line.match(prRegex)));
        // Do not add current line under the first release heading to deduped changelog if there is a PR mentioned in it
        // that is in the set of PRs to remove.
        if (releaseHeadingsCount === 1 && prsFromLine !== null && !prsFromLine.every((match) => !setOfPRsToRemove.has(match))) {
            continue;
        }
        dedupedChangelog += line;
        dedupedChangelog += '\n';
    }
    await writeFile(targetFile, dedupedChangelog);
}

await main();