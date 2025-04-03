// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { readFileSync } from 'node:fs';
import commonConfig from '../../common/config/rollup/rollup.config.mjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const commonConfigPackage = commonConfig(packageJson);
const externalDeps = commonConfigPackage.external.filter((dep) => dep !== 'react-dom');
const commonPlugins = commonConfigPackage.plugins.concat([nodeResolve()]);
commonConfigPackage.external = externalDeps;
commonConfigPackage.plugins = commonPlugins;
export default commonConfigPackage;
