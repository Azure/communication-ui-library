// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const videoHint = mergeStyles({
  bottom: '5%',
  height: '1.75rem',
  boxShadow: '0 0 1px 0 rgba(0,0,0,.16)',
  fontSize: '1.25rem',
  lineHeight: '1.0625rem',
  textAlign: 'left',
  left: '2%',
  overflow: 'hidden',
  position: 'absolute',
  padding: '0.25rem',
  whiteSpace: 'nowrap',
  maxWidth: '40%',
  borderRadius: 4
});

export const disabledVideoHint = mergeStyles(videoHint, {
  backgroundColor: 'transparent',
  boxShadow: 'none'
});

export const mediaContainer = mergeStyles({
  position: 'relative',
  height: '100%',
  width: '100%',
  background: 'transparent',
  display: 'flex'
});

export const mediaPersonaStyle = mergeStyles({
  margin: 'auto'
});

export const invertedVideoStyle = mergeStyles(mediaContainer, {
  transform: 'rotateY(180deg)'
});
