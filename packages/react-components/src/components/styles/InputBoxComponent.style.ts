// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, IStyle, FontWeights } from '@fluentui/react';

export const inputBoxWrapperStyle = mergeStyles({
  padding: '0'
});

export const inputBoxStyle = mergeStyles({
  minHeight: '2.25em', // prevents the input text box from being sized to 0px when the meeting composite chat pane is closed.
  maxHeight: '8.25em',
  outline: 'red 5px',
  fontWeight: FontWeights.regular,
  fontSize: '0.875em',
  width: '100%',
  height: '2.25em',
  lineHeight: '1.5em',
  '::-webkit-input-placeholder': {
    fontSize: '0.875em'
  },
  '::-moz-placeholder': {
    fontSize: '0.875em'
  },
  ':-moz-placeholder': {
    fontSize: '0.875em'
  }
});

export const textFieldStyle = (errorColor: string, hasErrorMessage: boolean, disabled: boolean): IStyle => {
  const borderColor = hasErrorMessage ? errorColor : 'none';
  return {
    root: {
      width: '100%',
      minHeight: '0',
      fontSize: '8.25em'
    },
    wrapper: {},
    fieldGroup: {
      height: 'auto',
      minHeight: '0',
      borderRadius: '0.25em',
      borderColor: borderColor,
      borderWidth: disabled ? '0px' : '1px',
      ':hover': { borderColor: borderColor },
      ':active': { borderColor: borderColor },
      ':after': { borderColor: borderColor, borderRadius: '0.25em' }
    },
    field: {
      borderRadius: '0.25em'
    },
    errorMessage: {
      color: errorColor
    }
  };
};

export const inputButtonStyle = mergeStyles({
  color: 'grey',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  margin: 'auto',
  top: '0',
  bottom: '0',
  width: '1.0625em',
  height: '1.0625em'
});

export const inputButtonContainerStyle = (rtl?: boolean): string =>
  mergeStyles({
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    right: !rtl ? '0.3em' : undefined,
    left: rtl ? '0.3em' : undefined
  });
