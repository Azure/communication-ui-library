// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IStyle, mergeStyles } from '@fluentui/react';

const theme = getTheme();
const palette = theme.palette;

export const rootStyles: IStyle = {
  position: 'relative',
  height: '100%',
  width: '100%'
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
  bottom: '0.5rem',
  boxShadow: 'none',
  textAlign: 'left',
  left: '0.5rem',
  overflow: 'hidden',
  position: 'absolute',
  padding: '0.25rem',
  lineHeight: '1.4286rem',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: 4,
  color: palette.neutralPrimaryAlt
});

export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  boxShadow: '0 0 1px 0 rgba(0,0,0,.5)',
  color: palette.white
});
