// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { readFileSync } from 'node:fs';
import commonConfig from '../../common/config/rollup/rollup.config.mjs';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const common = commonConfig(packageJson);

export default {
  ...common,
  external: [...(common.external || []), '@internal/fake-backends']
};
