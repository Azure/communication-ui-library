// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPO_ROOT = path.join(__dirname, '..', '..', '..');