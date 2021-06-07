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

export const videoHint = mergeStyles({
  backgroundColor: palette.neutralSecondary,
  bottom: '5%',
  boxShadow: '0 0 1px 0 rgba(0,0,0,.5)',
  color: palette.neutralLighter,
  textAlign: 'left',
  left: '2%',
  overflow: 'hidden',
  position: 'absolute',
  padding: '0.25rem',
  lineHeight: '1.4286rem',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: 4
});

export const disabledVideoHint = mergeStyles(videoHint, {
  backgroundColor: 'transparent',
  color: palette.neutralSecondary,
  boxShadow: 'none'
});
