// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioEffectsStartConfig } from '@azure/communication-calling';
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects';

/**
 *
 * Dependency resolution for video background effects using lazy loading.
 * @public
 */
export const onResolveDeepNoiseSuppressionDependency = async (): Promise<DeepNoiseSuppressionEffectDependency> => {
  const audioEffect: AudioEffectsStartConfig = {
    noiseSuppression: new DeepNoiseSuppressionEffect()
  };

  return { deepNoiseSuppressionEffect: audioEffect };
};
