// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const mainContainerStyle = mergeStyles({
  width: '100%',
  height: '100%',
  selectors: {
    '@media (max-width: 750px)': {
      padding: '0.625rem',
      height: '100%'
    }
  },
  justifyContent: 'center'
});

export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '18.75rem',
  border: '1px solid #605e5c',
  borderRadius: '2px',
  backgroundColor: '#FFFFFF',
  marginLeft: '2.2rem' // quickly align now we have the copy button
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

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.75rem',
  width: '100%',
  marginTop: '1.125rem',
  maxWidth: '18.75rem',
  minWidth: '8rem'
});

export const buttonIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});

export const buttonStackTokens: IStackTokens = {
  childrenGap: '0.5rem'
};
