// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { onResolveVideoEffectDependencyLazy } from '@azure/communication-react';

export const loadVideoEffectsDependency = async function () {
  return onResolveVideoEffectDependencyLazy;
};
