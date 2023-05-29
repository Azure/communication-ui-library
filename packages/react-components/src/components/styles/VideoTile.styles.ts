// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStyle, mergeStyles, Theme } from '@fluentui/react';

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
export const pinIconStyle: IStyle = {
  padding: '0.125rem'
};

/**
 * @private
 */
export const iconContainerStyle: IStyle = {
  margin: 'auto',
  alignItems: 'center',
  '& svg': {
    display: 'block',
    // Similar to text color, icon color will be inherited from parent container
    color: 'inherit'
  }
};

/**
 * @private
 */
export const participantStateStringStyles = (theme: Theme): IStyle => {
  return {
    minWidth: 'max-content',
    color: theme.palette.black,
    fontSize: '0.75rem',
    lineHeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0.1rem'
  };
};

/**
 * @private
 */
export const moreButtonStyles: IButtonStyles = {
  root: {
    // To ensure that the button is clickable when there is a floating video tile
    zIndex: 1,
    color: 'inherit',
    top: '-0.125rem',
    height: '100%',
    padding: '0rem'
  },
  rootHovered: {
    background: 'none'
  },
  rootPressed: {
    background: 'none'
  },
  rootExpanded: {
    background: 'none'
  }
};
