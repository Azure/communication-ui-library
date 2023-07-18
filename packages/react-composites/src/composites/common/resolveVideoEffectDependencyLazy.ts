// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type {
  BackgroundBlurConfig,
  BackgroundBlurEffect,
  BackgroundReplacementConfig,
  BackgroundReplacementEffect
} from '@azure/communication-calling';
import { VideoBackGroundDependency } from '../CallComposite';

/**
 *
 * @public
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const onResolveVideoEffectDependencyLazy = async (): Promise<VideoBackGroundDependency> => {
  const module = await import('@azure/communication-calling-effects');
  // eslint-disable-next-line jsdoc/require-jsdoc
  const createBackgroundBlurEffect = (config?: BackgroundBlurConfig): BackgroundBlurEffect => {
    return new module.BackgroundBlurEffect(config);
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  const createBackgroundReplacementEffect = (config: BackgroundReplacementConfig): BackgroundReplacementEffect => {
    return new module.BackgroundReplacementEffect(config);
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  const videoBackGroundDependency: VideoBackGroundDependency = {
    createBackgroundBlurEffect,
    createBackgroundReplacementEffect
  };
  return videoBackGroundDependency;
};
