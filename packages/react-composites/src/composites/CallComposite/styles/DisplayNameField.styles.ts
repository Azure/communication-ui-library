// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const TextFieldStyleProps = {
  wrapper: {
    height: '2.3rem'
  },
  fieldGroup: {
    height: '2.3rem'
  }
};

/**
 * @private
 */
export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '18.75rem',
  borderRadius: '0.125rem'
});

/**
 * @private
 */
export const inputBoxTextStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  }
});

/**
 * @private
 */
export const inputBoxWarningStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '18.75rem',
  borderRadius: '2px',
  fontSize: '0.875rem'
});

/**
 * @private
 */
export const labelFontStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  boxSizing: 'border-box',
  boxShadow: 'none',
  margin: 0,
  display: 'inline-block',
  padding: '5px 0px',
  overflowWrap: 'break-word'
});

/**
 * @private
 */
export const warningStyle = mergeStyles({
  width: '18.75rem',
  marginTop: '0.188rem',
  marginBottom: '0.188rem',
  marginLeft: '0.188rem',
  color: '#e81123',
  fontSize: '.7375rem',
  fontWeight: '400',
  position: 'absolute'
});
