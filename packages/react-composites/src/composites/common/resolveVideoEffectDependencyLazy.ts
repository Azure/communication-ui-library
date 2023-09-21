// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(video-background-effects) */
import type {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(video-background-effects) */
/**
 *
 * Dependency resolution for video background effects using lazy loading.
 * @public
 */
export const onResolveVideoEffectDependencyLazy = async (): Promise<VideoBackgroundEffectsDependency> => {
  const module = await import('@azure/communication-calling-effects');
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new module.BackgroundBlurEffect(config);
  };
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new module.BackgroundReplacementEffect(config);
  };
  const VideoBackgroundEffectsDependency: VideoBackgroundEffectsDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return VideoBackgroundEffectsDependency;
};
