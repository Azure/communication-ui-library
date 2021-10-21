// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const mediaContainer = (theme: Theme) =>
  mergeStyles({
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
export const invertedVideoStyle = (theme: Theme) =>
  mergeStyles(mediaContainer(theme), {
    transform: 'rotateY(180deg)'
  });
