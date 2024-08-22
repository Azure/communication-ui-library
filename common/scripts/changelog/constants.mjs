// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { REPO_ROOT } from '../lib/index.mjs';

export const BEACHBALL = path.join(REPO_ROOT, 'common', 'config', 'node_modules', 'beachball', 'bin', 'beachball');
export const STABLE_CHANGE_DIR_NAME = 'change';
export const BETA_CHANGE_DIR_NAME = 'change-beta';
export const CHANGE_DIR_STABLE = path.join(REPO_ROOT, STABLE_CHANGE_DIR_NAME);
export const CHANGE_DIR_BETA = path.join(REPO_ROOT, BETA_CHANGE_DIR_NAME);

const COMMUNICATION_REACT_PACKLET = path.join(REPO_ROOT, 'packages', 'communication-react');
export const COMMUNICATION_REACT_CHANGELOG_STABLE = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.stable.md');
export const COMMUNICATION_REACT_CHANGELOG_BETA = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.beta.md');
export const COMMUNICATION_REACT_CHANGELOG_TEMPORARY = path.join(COMMUNICATION_REACT_PACKLET, 'CHANGELOG.md');