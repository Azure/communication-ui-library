// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(video-background-effects) */
import type {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundDependency } from '../CallComposite';

/* @conditional-compile-remove(video-background-effects) */
/**
 *
 * Dependency resolution for video background effects using lazy loading.
 * @beta
 */
export const onResolveVideoEffectDependencyLazy = async (): Promise<VideoBackgroundDependency> => {
  const module = await import('@azure/communication-calling-effects');
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new module.BackgroundBlurEffect(config);
  };
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new module.BackgroundReplacementEffect(config);
  };
  const videoBackgroundDependency: VideoBackgroundDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return videoBackgroundDependency;
};
