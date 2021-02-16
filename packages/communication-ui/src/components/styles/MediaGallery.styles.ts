// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const mediaGalleryStyle = mergeStyles({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  borderRight: '1px solid rgba(0,0,0,0.05)',
  borderBottom: '1px solid rgba(0,0,0,0.05)'
});

export const mediaGalleryGridStyle = mergeStyles({
  height: 'inherit',
  background: palette.neutralLighterAlt,
  display: 'grid',
  flexGrow: '1'
});
