// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

export const TextFieldStyleProps = {
  fieldGroup: {
    height: '2.3rem'
  }
};

export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  borderRadius: '0.125rem'
});

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
