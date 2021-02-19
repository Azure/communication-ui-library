// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

const videoBaseStyle = mergeStyles({
  border: 0,
  borderRight: '1px solid rgba(0,0,0,0.05)',
  borderBottom: '1px solid rgba(0,0,0,0.05)'
});

export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

export const aspectRatioBoxStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: 0,
  position: 'relative',
  paddingTop: '56.25%' /* defualt to 16:9 Aspect Ratio for now*/
});

export const aspectRatioBoxContentStyle = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});
