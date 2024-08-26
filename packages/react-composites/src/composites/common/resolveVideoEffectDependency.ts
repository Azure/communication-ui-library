// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling-effects';
/* @conditional-compile-remove(DNS) */
import { AudioEffectsStartConfig } from '@azure/communication-calling';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffect } from '@azure/communication-calling-effects';
/* @conditional-compile-remove(DNS) */
import type { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';
import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';

/**
 * Dependency resolution for video background effects.
 *
 * @public
 */
export const onResolveVideoEffectDependency = async (): Promise<VideoBackgroundEffectsDependency> => {
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new BackgroundBlurEffect(config);
  };
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new BackgroundReplacementEffect(config);
  };
  const VideoBackgroundEffectsDependency: VideoBackgroundEffectsDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return VideoBackgroundEffectsDependency;
};

/* @conditional-compile-remove(DNS) */
/**
 *
 * Dependency resolution for video background effects using lazy loading.
 * @beta
 */
export const onResolveDeepNoiseSuppressionDependency = async (): Promise<DeepNoiseSuppressionEffectDependency> => {
  const audioEffect: AudioEffectsStartConfig = {
    noiseSuppression: new DeepNoiseSuppressionEffect()
  };

  return { deepNoiseSuppressionEffect: audioEffect };
};
