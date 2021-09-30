// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IStyle } from '@fluentui/react';

const theme = getTheme();

/**
 * @private
 */
export const leftRightButtonStyles: IStyle = {
  background: 'none',
  border: `1px solid ${theme.palette.neutralLight}`,
  padding: 0,
  borderRadius: theme.effects.roundedCorner4
};

/**
 * @private
 */
export const horizontalGalleryContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  paddingBottom: '0.5rem'
};
