// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IStyle } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const leftRightButtonStyles: IStyle = {
  minWidth: '1.75rem',
  minHeight: '7.5rem',
  maxWidth: '1.75rem',
  maxHeight: '7.5rem',
  background: '#FFF',
  border: '1px solid #F3F2F1',
  borderRadius: theme.effects.roundedCorner4
};
