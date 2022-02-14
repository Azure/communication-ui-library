// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle, Theme } from '@fluentui/react';

/**
 * @private
 */
export const suppressIconStyle = {
  iconContainer: { minHeight: '0', minWidth: '0', height: '0', width: '0', margin: '0' },
  icon: { display: 'none' }
};

/**
 * @private
 */
export const sendBoxWrapperStyles = mergeStyles({
  margin: '0.25rem',
  overflow: 'hidden',
  ':not(:first-child)': {
    marginTop: '0.25rem'
  }
});

/**
 * @private
 */
export const sendBoxStyle = mergeStyles({
  paddingRight: '2rem'
});

/**
 * @private
 */
export const sendButtonStyle = mergeStyles({
  height: '1.25rem',
  width: '1.25rem',
  marginRight: '0.313rem' // 5px
});

/**
 * @private
 */
export const sendIconStyle = mergeStyles({
  width: '1.25rem',
  height: '1.25rem',
  margin: 'auto'
});

/**
 * @private
 */
export const fileCardBoxStyle = mergeStyles({
  width: '100%',
  padding: '0.50rem'
});

/**
 * @private
 */
export const borderAndBoxShadowStyle = (theme: Theme): IStyle => {
  return {
    borderRadius: theme.effects.roundedCorner4,
    border: `0.0625rem solid ${theme.palette.neutralSecondary}`,
    ':hover': {
      border: '2px solid',
      borderColor: theme.palette.blue
    },
    ':active': {
      border: '2px solid',
      borderColor: theme.palette.blue
    },
    ':focus': {
      border: '2px solid',
      borderColor: theme.palette.blue
    },
    ':focus-within': {
      border: '2px solid',
      borderColor: theme.palette.blue
    }
  };
};
