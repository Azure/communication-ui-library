// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(DNS) */
import { AudioEffectsStartConfig } from '@azure/communication-calling';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(DNS) */
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
