// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, getTheme, mergeStyles } from '@fluentui/react';

const theme = getTheme();

export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  borderRadius: theme.effects.roundedCorner4
};

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

export const overlayContainerStyles: IStyle = {
  width: '100%',
  height: '100%',
  zIndex: 5
};

export const disabledVideoHint = mergeStyles({
  bottom: '0.46875rem',
  boxShadow: 'none',
  textAlign: 'left',
  left: '0.5rem',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: theme.effects.roundedCorner4
});

export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: 'rgba(255, 255, 255, 0.8)'
});

export const displayNameStyle: IStyle = {
  padding: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 600
};
