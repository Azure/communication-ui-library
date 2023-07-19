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
import { VideoBackGroundDependency } from '../CallComposite';

/**
 *
 * @public
 */
/* @conditional-compile-remove(video-background-effects) */
// eslint-disable-next-line jsdoc/require-jsdoc
export const onResolveVideoEffectDependency = async (): Promise<VideoBackGroundDependency> => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new BackgroundBlurEffect(config);
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new BackgroundReplacementEffect(config);
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  const videoBackGroundDependency: VideoBackGroundDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return videoBackGroundDependency;
};

export {};
