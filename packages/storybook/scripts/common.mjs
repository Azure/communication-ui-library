// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from '../../../common/scripts/lib/index.mjs';

// This function sets additional environment variables for the storybook build steps,
// to workaround issues between node 18 and storybook 6
// It can be removed with storybook 7 potentially.
export async function getExtraEnv() {
  const nodeMajorVersion = parseInt(process.version.split('.')[0].slice(1));
  return nodeMajorVersion > 16 ? { NODE_OPTIONS: '--openssl-legacy-provider' } : undefined;
}
