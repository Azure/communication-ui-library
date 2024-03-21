// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling-effects';

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
