// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IStyle, mergeStyles } from '@fluentui/react';

export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  background: palette.neutralLighter,
  borderRadius: 4
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
  padding: '0.25rem',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '1rem',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: 4,
  color: palette.neutralPrimary
});

export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: 'rgba(255, 255, 255, 0.8)'
});
