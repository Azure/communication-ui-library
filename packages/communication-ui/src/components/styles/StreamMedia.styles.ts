// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const mediaContainer = mergeStyles({
  position: 'relative',
  height: '100%',
  width: '100%',
  background: 'transparent',
  display: 'flex',
  '& video': {
    borderRadius: '.25rem'
  }
});

export const invertedVideoStyle = mergeStyles(mediaContainer, {
  transform: 'rotateY(180deg)'
});
