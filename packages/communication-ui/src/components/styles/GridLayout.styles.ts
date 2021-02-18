// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const gridLayoutStyle = mergeStyles({
  height: 'inherit',
  background: palette.neutralLighterAlt,
  display: 'grid',
  flexGrow: '1'
});
