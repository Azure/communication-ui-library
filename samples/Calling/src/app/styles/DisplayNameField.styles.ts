// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * Style properties for the TextField component's field group.
 * Controls the height of the input field.
 */
export const TextFieldStyleProps = {
  fieldGroup: {
    height: '2.3rem'
  }
};

/**
 * Styles for the input box container.
 * Defines box sizing and border radius properties.
 */
export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  borderRadius: '0.125rem'
});

/**
 * Text styles for the input field and its placeholders.
 * Applies consistent font size, weight, and line height across
 * the input text and placeholders in different browsers.
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
