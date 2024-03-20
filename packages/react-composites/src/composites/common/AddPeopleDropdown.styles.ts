// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IContextualMenuStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const themedCopyLinkButtonStyles = (theme: Theme, mobileView?: boolean): Partial<IButtonStyles> => ({
  root: {
    minHeight: mobileView ? '3rem' : '2.5rem',
    borderRadius: mobileView ? theme.effects.roundedCorner6 : theme.effects.roundedCorner4,
    width: '100%'
  },
  textContainer: {
    display: 'contents'
  }
});

/**
 * @private
 */
export const themedMenuStyle = (theme: Theme): Partial<IContextualMenuStyles> => ({
  root: {
    borderRadius: theme.effects.roundedCorner6
  }
});

/**
 * @private
 */
export const iconStyles = {
  // overwrite default line height which results in icons having different size
  lineHeight: '0',
  width: '1.125rem'
};
