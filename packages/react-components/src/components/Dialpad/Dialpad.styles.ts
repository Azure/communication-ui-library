// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, ITextFieldStyles, Theme } from '@fluentui/react';

/**
 * @private
 */
export const containerStyles = (theme: Theme): IStyle => {
  return {
    width: '18.75rem',
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
export const rowStyles = (theme: Theme): IStyle => {
  return {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    background: `${theme.palette.white}`
  };
};

/**
 * @private
 */
export const digitStyles = (theme: Theme): IStyle => {
  return {
    padding: '0.625rem 1.875rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: `${theme.palette.neutralPrimary}`,
    border: 'none',
    background: `${theme.palette.white}`,
    flex: '1 1 0px'
  };
};

/**
 * @private
 */
export const textFieldStyles = (theme: Theme): Partial<ITextFieldStyles> => ({
  field: {
    padding: 0,
    textAlign: 'center',
    fontSize: '0.875rem'
  },
  root: {
    backgroundColor: `${theme.palette.neutralLighter}`,
    borderRadius: '0.125rem',
    marginBottom: '0.625rem'
  },
  fieldGroup: {
    border: 'none',
    backgroundColor: `${theme.palette.neutralLighter}`
  }
});

/**
 * @private
 */
export const subStyles = (theme: Theme): IStyle => {
  return {
    fontSize: '0.625rem',
    color: '#797775',
    fontWeight: 400,
    margin: '0.125rem',
    background: `${theme.palette.white}`
  };
};
