// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { IButtonStyles, IStyle, ITextFieldStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const containerStyles = (theme: Theme): IStyle => {
  return {
    maxWidth: '16rem',
    textAlign: 'center',
    background: `${theme.palette.white}`,
    borderRadius: '0.75rem',
    margin: 'auto'
  };
};

/**
 * @private
 */
export const buttonStyles = (theme: Theme): IButtonStyles => ({
  root: {
    background: 'none',
    fontWeight: 600,
    fontSize: `${_pxToRem(20)}`,
    border: 'none',
    borderRadius: 0,
    width: '3rem',
    height: '3rem',
    padding: `${_pxToRem(16)}, ${_pxToRem(5)}, ${_pxToRem(16)}, ${_pxToRem(5)}`,
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
    color: `${theme.palette.themePrimary}`
  };
};

/**
 * @private
 */
export const textFieldStyles = (theme: Theme, buttonPresent: boolean): Partial<ITextFieldStyles> => ({
  field: {
    padding: 0,
    textAlign: 'center',
    fontSize: `${_pxToRem(18)}`,
    fontWeight: 400,
    width: `${buttonPresent ? '10rem' : '12rem'}`,
    height: '3rem',
    borderRadius: '0.5rem',
    position: 'relative',
    overflowX: 'hidden',
    textOverflow: 'clip'
  },
  root: {
    backgroundColor: `${theme.palette.neutralLighter}`,
    marginBottom: '0.625rem',
    height: '3rem',
    borderRadius: '0.5rem'
  },
  fieldGroup: {
    border: 'none',
    borderRadius: '0.5rem',
    width: '12rem',
    height: '3rem',
    backgroundColor: `${theme.palette.neutralLighter}`,
    ':after': {
      borderRadius: '0.5rem'
    }
  },
  errorMessage: {
    color: theme.semanticColors.errorText
  },
  suffix: {
    padding: 0,
    position: 'absolute',
    right: '0.25rem',
    top: '0.55rem',
    transform: 'scale(1.15)',
    background: 'unset'
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
      color: `${theme.palette.black}`,
      padding: 0,
      background: 'transparent'
    },
    icon: {
      height: 'auto',
      background: 'transparent',
      // Needed to keep the icon vertically centered.
      '> span': {
        display: 'flex'
      }
    }
  };
};
