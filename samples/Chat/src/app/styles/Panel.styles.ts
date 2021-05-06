//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const panelMainStyle = mergeStyles({
  boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13)'
});

export const panelNoAnimationMainStyle = mergeStyles(panelMainStyle, {
  animation: 'none'
});

export const panelContentStyle = mergeStyles({
  paddingTop: '1.125rem',
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto'
});
