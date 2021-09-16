// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const mediaContainer = mergeStyles({
  position: 'relative',
  height: '100%',
  width: '100%',
  background: 'transparent',
  display: 'flex',
  '& video': {
    borderRadius: '.25em'
  }
});

export const invertedVideoStyle = mergeStyles(mediaContainer, {
  transform: 'rotateY(180deg)'
});
