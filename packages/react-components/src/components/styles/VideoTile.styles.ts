// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IStyle, getTheme, mergeStyles } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  borderRadius: theme.effects.roundedCorner4
};

/**
 * @private
 */
export const isSpeakingStyles: IStyle = {
  border: `0.25rem solid ${theme.palette.themePrimary}`
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
  borderRadius: theme.effects.roundedCorner4,
  alignItems: 'center',
  padding: '0.15rem'
});

/**
 * @private
 */
export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: palette.white,
  opacity: 0.8,
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
