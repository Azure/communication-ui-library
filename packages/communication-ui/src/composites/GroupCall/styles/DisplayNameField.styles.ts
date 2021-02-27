// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const TextFieldStyleProps = {
  wrapper: {
    height: '2.3rem'
  },
  fieldGroup: {
    height: '2.3rem'
  }
};

export const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '18.75rem',
  border: '1px solid #605e5c',
  borderRadius: '2px',
  backgroundColor: '#FFFFFF'
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

export const inputBoxWarningStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '18.75rem',
  border: '1px solid #e81123',
  borderRadius: '2px',
  backgroundColor: '#FFFFFF',
  fontSize: '0.875rem'
});

export const labelFontStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'rgb(50, 49, 48)',
  boxSizing: 'border-box',
  boxShadow: 'none',
  margin: 0,
  display: 'inline-block',
  padding: '5px 0px',
  overflowWrap: 'break-word'
});

export const warningStyle = mergeStyles({
  width: '18.75rem',
  backgroundColor: '#FFFFFF',
  marginTop: '0.188rem',
  marginBottom: '0.188rem',
  marginLeft: '0.188rem',
  color: '#e81123',
  fontSize: '.7375rem',
  fontWeight: '400',
  position: 'absolute'
});
