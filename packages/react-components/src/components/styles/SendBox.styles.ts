// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle } from '@fluentui/react';

export const textFieldStyle = (errorColor: string, hasErrorMessage: boolean, disabled: boolean): IStyle => {
  const borderColor = hasErrorMessage ? errorColor : 'none';
  return {
    root: {
      width: '100%',
      minHeight: '0',
      fontSize: '8.25rem'
    },
    wrapper: {},
    fieldGroup: {
      height: 'auto',
      minHeight: '0',
      borderRadius: '0.25rem',
      borderColor: borderColor,
      borderWidth: disabled ? '0px' : '1px',
      ':hover': { borderColor: borderColor },
      ':active': { borderColor: borderColor },
      ':after': { borderColor: borderColor, borderRadius: '0.25rem' }
    },
    field: {
      borderRadius: '0.25rem'
    },
    errorMessage: {
      color: errorColor
    }
  };
};

export const sendBoxWrapperStyle = mergeStyles({
  padding: '0.0625rem'
});

export const suppressIconStyle = {
  iconContainer: { minHeight: '0', minWidth: '0', height: '0', width: '0', margin: '0' },
  icon: { display: 'none' }
};

export const sendBoxStyle = mergeStyles({
  minHeight: '0',
  maxHeight: '8.25rem',
  outline: 'red 5px',
  fontWeight: 400,
  fontSize: '0.875rem',
  width: '100%',
  height: '2.25rem',
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem'
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem'
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem'
  }
});

export const sendButtonStyle = mergeStyles({
  color: 'grey',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  top: '0.75rem'
});

export const sendIconStyle = mergeStyles({
  width: '1.0625rem',
  height: '1.0625rem'
});
