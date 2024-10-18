// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(DNS) */
import { AudioEffectsStartConfig } from '@azure/communication-calling';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects';

/* @conditional-compile-remove(DNS) */
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
