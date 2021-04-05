// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

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
  paddingTop: '56.25%' /* default to 16:9 Aspect Ratio for now*/
});

export const aspectRatioBoxContentStyle = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

export const stackContainerStyle = mergeStyles({
  height: '100%',
  width: '25%'
});

export const screenShareContainerStyle = mergeStyles({
  height: '100%',
  width: '75%',
  position: 'relative'
});

export const disabledVideoHint = mergeStyles({
  bottom: '5%',
  height: '1.75rem',
  boxShadow: 'none',
  fontSize: '1.25rem',
  lineHeight: '1.0625rem',
  textAlign: 'left',
  left: '2%',
  overflow: 'hidden',
  position: 'absolute',
  padding: '0.25rem',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: 4
});

export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: palette.neutralSecondary,
  boxShadow: '0 0 1px 0 rgba(0,0,0,.16)',
  color: palette.white
});
