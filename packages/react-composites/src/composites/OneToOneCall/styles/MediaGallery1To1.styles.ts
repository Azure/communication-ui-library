// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, mergeStyles } from '@fluentui/react';

export const mediaGallery1To1Style = mergeStyles({
  position: 'relative',
  height: '100%',
  width: '100%'
});

export const localMediaGalleryTileStyle = mergeStyles({
  width: '12rem',
  height: '7rem',
  marginTop: '-7.25rem',
  marginRight: '.25rem',
  background: palette.neutralLighterAlt,
  border: '1px solid rgba(0,0,0,0.05)'
});

export const remoteMediaGalleryTileStyle = mergeStyles({
  height: '100%',
  width: '100%',
  background: palette.neutralLighterAlt
});

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
