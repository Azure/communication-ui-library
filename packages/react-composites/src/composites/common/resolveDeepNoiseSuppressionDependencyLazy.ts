// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioEffectsStartConfig } from '@azure/communication-calling';
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';

/**
 *
 * Dependency resolution for video background effects using lazy loading.
 * @public
 */
export const onResolveDeepNoiseSuppressionDependencyLazy = async (): Promise<DeepNoiseSuppressionEffectDependency> => {
  const module = await import('@azure/communication-calling-effects');
  const audioEffect: AudioEffectsStartConfig = {
    noiseSuppression: new module.DeepNoiseSuppressionEffect()
  };

  return { deepNoiseSuppressionEffect: audioEffect };
};
