// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(video-background-effects) */
import {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling-effects';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundDependency } from '../CallComposite';

/* @conditional-compile-remove(video-background-effects) */
/**
 * Dependency resolution for video background effects.
 *
 * @beta
 */
export const onResolveVideoEffectDependency = async (): Promise<VideoBackgroundDependency> => {
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new BackgroundBlurEffect(config);
  };
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new BackgroundReplacementEffect(config);
  };
  const videoBackgroundDependency: VideoBackgroundDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return videoBackgroundDependency;
};
