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
  /**
   * margin-top set for all the child components of sendbox except first
   */
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
export const borderAndBoxShadowStyle = (props: {
  theme: Theme;
  errorColor: string;
  hasErrorMessage: boolean;
  disabled: boolean;
}): IStyle => {
  const { theme, errorColor, hasErrorMessage, disabled } = props;
  const borderColorActive = hasErrorMessage ? errorColor : theme.palette.blue;
  const borderColor = hasErrorMessage ? errorColor : theme.palette.neutralSecondary;
  return {
    borderRadius: theme.effects.roundedCorner4,
    borderWidth: disabled ? '0px' : '1px',
    border: `0.0625rem solid ${borderColor}`,
    ':hover': {
      border: '2px solid',
      borderColor: borderColorActive
    },
    ':active': {
      border: '2px solid',
      borderColor: borderColorActive
    },
    ':focus': {
      border: '2px solid',
      borderColor: borderColorActive
    },
    ':focus-within': {
      border: '2px solid',
      borderColor: borderColorActive
    }
  };
};

/**
 * @private
 */
export const errorBarStyle = (theme: Theme): IStyle => {
  return {
    background: '#FFF4CE',
    padding: '0.50rem',
    borderRadius: theme.effects.roundedCorner4
  };
};
