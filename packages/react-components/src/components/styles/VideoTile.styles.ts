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
export const tileInfoContainerStyle = mergeStyles({
  position: 'absolute',
  bottom: '0',
  left: '0',
  padding: '0.5rem',
  width: '100%'
});

/**
 * @private
 */
export const disabledVideoHint = mergeStyles({
  backgroundColor: 'inherit',
  boxShadow: 'none',
  textAlign: 'left',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  alignItems: 'center',
  padding: '0.15rem',
  maxWidth: '100%'
});

/**
 * @private
 */
export const videoHint = mergeStyles(disabledVideoHint, {
  // This will appear on top of the video stream, so no dependency on theme and explicitly use a translucent white
  backgroundColor: 'rgba(255,255,255,0.8)'
});

/**
 * @private
 */
export const displayNameStyle: IStyle = {
  padding: '0.1rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  // Text component will take body color by default (white in Dark Mode), so forcing it to be parent container color
  color: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};

/**
 * @private
 */
export const iconContainerStyle: IStyle = {
  margin: 'auto',
  alignItems: 'center',
  '& svg': {
    display: 'block'
  }
};

/**
 * @private
 */
export const participantStateStringStyles = (showLabel: boolean): IStyle => {
  return {
    textAlign: showLabel ? 'left' : 'center',
    minWidth: 'max-content',
    color: 'inherit',
    width: showLabel ? 'auto' : '100%',
    fontSize: '0.75rem',
    lineHeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0.15rem'
  };
};
