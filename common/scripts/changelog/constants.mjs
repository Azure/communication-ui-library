// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import path from 'path';
import { REPO_ROOT } from '../lib/index.mjs';

export const BEACHBALL = path.join(REPO_ROOT, 'common', 'config', 'node_modules', 'beachball', 'bin', 'beachball');
export const CHANGE_DIR = path.join(REPO_ROOT, 'change');
export const CHANGE_DIR_BETA = path.join(REPO_ROOT, 'change-beta');
// .gitignored
export const CHANGE_DIR_STABLE_TEMP = path.join(REPO_ROOT, 'change-stable');

const COMMUNICATION_REACT_PACKLET = path.join(REPO_ROOT, 'packages', 'communication-react');
export const COMMUNICATION_REACT_CHANGELOG_STABLE = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.stable.md');
export const COMMUNICATION_REACT_CHANGELOG_BETA = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.beta.md');
export const COMMUNICATION_REACT_CHANGELOG_TEMPORARY = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.md');