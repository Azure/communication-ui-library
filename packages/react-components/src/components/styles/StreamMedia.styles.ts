// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const mediaContainer = mergeStyles({
  position: 'relative',
  height: '100%',
  width: '100%',
  background: 'transparent',
  display: 'flex',
  '& video': {
    borderRadius: theme.effects.roundedCorner4
  }
});

/**
 * @private
 */
export const invertedVideoStyle = mergeStyles(mediaContainer, {
  transform: 'rotateY(180deg)'
});
