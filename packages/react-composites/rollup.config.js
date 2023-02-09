// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Package from './package.json';
import commonConfig from '../../common/config/rollup/rollup.config';

const common = commonConfig(Package);

export default {
  ...common,
  external: [...(common.external || []), '@internal/fake-backends']
};
