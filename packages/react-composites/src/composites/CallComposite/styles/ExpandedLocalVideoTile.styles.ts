// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles } from '@fluentui/react';
import { IStyle } from '@fluentui/react';

// By default, absolute positioned elements are overlayed over static ones.
// So we need to explicitly layer the background and contents.
const OVERLAY_BACKGROUND_ZINDEX = 0;
const OVERLAY_CONTENT_ZINDEX = OVERLAY_BACKGROUND_ZINDEX + 1;

/**
 * @private
 */
export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: '0.5rem'
  }
};

/**
 * @private
 */
export const overlayBackgroundStyles: (isVideoReady: boolean) => IStyle = (isVideoReady) => {
  return {
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: isVideoReady ? 'black' : undefined,
    opacity: isVideoReady ? 0.6 : undefined,
    zIndex: OVERLAY_BACKGROUND_ZINDEX
  };
};

/**
 * @private
 */
export const overlayContentStyles: IStyle = {
  height: '100%',
  width: '100%',
  zIndex: OVERLAY_CONTENT_ZINDEX
};

/**
 * @private
 */
export const videoTileStyles = {
  root: { height: '100%', width: '100%' }
};
