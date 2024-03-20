// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const inputBoxButtonStyle = mergeStyles({
  color: 'grey',
  margin: 'auto',
  width: '1.0625rem',
  height: '1.0625rem',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

/**
 * @private
 */
export const inputBoxButtonTooltipStyle = mergeStyles({
  // The toolTip host container show be a flex box, so that alignItems: 'center' works for inside buttons
  display: 'flex'
});

/**
 * @private
 */
export const iconWrapperStyle = mergeStyles({
  pointerEvents: 'none'
});
