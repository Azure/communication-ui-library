// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%'
};

/**
 * @private
 */
export const videoContainerStyles: IStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  minWidth: '100%',
  minHeight: '100%',
  objectPosition: 'center',
  objectFit: 'cover',
  zIndex: 0
};

/**
 * @private
 */
export const overlayContainerStyles: IStyle = {
  width: '100%',
  height: '100%',
  zIndex: 5
};

/**
 * @private
 */
export const disabledVideoHint = mergeStyles({
  backgroundColor: 'inherit',
  bottom: '0.46875rem',
  boxShadow: 'none',
  textAlign: 'left',
  left: '0.5rem',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  alignItems: 'center',
  padding: '0.15rem'
});

/**
 * @private
 */
export const videoHint = mergeStyles(disabledVideoHint, {
  // This will appear on top of the video stream, so no dependency on theme and explicitly use a translucent white
  backgroundColor: 'rgba(255,255,255,0.8)',
  padding: '0.15rem'
});

/**
 * @private
 */
export const displayNameStyle: IStyle = {
  padding: '0.1rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  // Text component will take body color by default (white in Dark Mode), so forcing it to be parent container color
  color: 'inherit'
};

/**
 * @private
 */
export const iconContainerStyle: IStyle = {
  padding: '0.1rem',
  height: '100%',
  alignItems: 'center',
  '& svg': {
    display: 'block'
  }
};

/**
 * @private
 */
export const tileInfoStackItemStyle: IStyle = {
  display: 'flex'
};

/**
 * @private
 */
export const isSpeakingBorderDiv: IStyle = {
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0',
  left: '0'
};
