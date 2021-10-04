// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, IStyle, FontWeights } from '@fluentui/react';

/**
 * @private
 */
export const inputBoxWrapperStyle = mergeStyles({
  padding: '0'
});

/**
 * @private
 */
export const inputBoxStyle = mergeStyles({
  minHeight: '2.25rem', // prevents the input text box from being sized to 0px when the meeting composite chat pane is closed.
  maxHeight: '8.25rem',
  outline: 'red 5px',
  fontWeight: FontWeights.regular,
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

/**
 *
 * @private
 */
export const textContainerStyle: IStyle = {
  alignSelf: 'center',
  position: 'relative',
  width: '100%'
};

/**
 * @private
 */
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

/**
 * @private
 */
export const inputButtonStyle = mergeStyles({
  color: 'grey',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  margin: 'auto',
  top: '0',
  bottom: '0',
  width: '1.0625rem',
  height: '1.0625rem'
});

/**
 * @private
 */
export const inputButtonContainerStyle = (rtl?: boolean): string =>
  mergeStyles({
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    right: !rtl ? '0.3rem' : undefined,
    left: rtl ? '0.3rem' : undefined
  });
