// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const TextFieldStyleProps = {
  wrapper: {
    height: '2.3em'
  },
  fieldGroup: {
    height: '2.3em'
  }
};

export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  borderRadius: '0.125em'
});

export const inputBoxTextStyle = mergeStyles({
  fontSize: '0.875em',
  fontWeight: 600,
  lineHeight: '1.5em',
  '::-webkit-input-placeholder': {
    fontSize: '0.875em',
    fontWeight: 600
  },
  '::-moz-placeholder': {
    fontSize: '0.875em',
    fontWeight: 600
  },
  ':-moz-placeholder': {
    fontSize: '0.875em',
    fontWeight: 600
  }
});
