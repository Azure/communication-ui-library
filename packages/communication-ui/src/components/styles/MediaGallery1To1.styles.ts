// © Microsoft Corporation. All rights reserved.

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
