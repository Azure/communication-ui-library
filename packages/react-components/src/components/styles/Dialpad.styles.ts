// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { IButtonStyles, IStyle, ITextFieldStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const containerStyles = (theme: Theme): IStyle => {
  return {
    maxWidth: '16rem',
    padding: '1.25rem',
    margin: '1.5rem',
    textAlign: 'center',
    background: `${theme.palette.white}`,
    borderRadius: '0.75rem'
  };
};

/**
 * @private
 */
export const buttonStyles = (theme: Theme): IButtonStyles => ({
  root: {
    background: 'none',
    border: 'none',
    borderRadius: 0,
    width: '100%',
    padding: '1.875rem',
    minWidth: 0,
    minHeight: 0
  }
});

/**
 * @private
 */
export const digitStyles = (theme: Theme): IStyle => {
  return {
    fontSize: '1.25rem',
    fontWeight: theme.fonts.medium.fontWeight,
    color: `${theme.palette.neutralPrimary}`
  };
};

/**
 * @private
 */
export const textFieldStyles = (theme: Theme): Partial<ITextFieldStyles> => ({
  field: {
    padding: 0,
    textAlign: 'left',
    fontSize: '0.875rem',
    paddingLeft: '0.5rem'
  },
  root: {
    backgroundColor: `${theme.palette.neutralLighter}`,
    borderRadius: '0.125rem',
    marginBottom: '0.625rem'
  },
  fieldGroup: {
    border: 'none',
    backgroundColor: `${theme.palette.neutralLighter}`
  },

  errorMessage: {
    color: theme.semanticColors.errorText
  },
  suffix: {
    padding: 0
  }
});

/**
 * @private
 */
export const letterStyles = (theme: Theme): IStyle => {
  return {
    fontSize: '0.625rem',
    color: `${theme.palette.neutralSecondary}`,
    fontWeight: 400,
    margin: '0.125rem',
    minHeight: '0.75rem'
  };
};

/**
 * @private
 */
export const iconButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      color: `${theme.palette.black}`
    }
  };
};
