// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const TextFieldStyleProps = {
  root: {
    width: '100%',
    minHeight: '0px',
    fontSize: '8.25rem'
  },
  wrapper: {},
  fieldGroup: {
    height: 'auto',
    minHeight: '0px'
  }
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
  width: '2.25rem',
  color: 'grey',
  paddingLeft: '0.5rem',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const sendIconDiv = mergeStyles({
  width: '1.0625rem',
  height: '1.0625rem',
  '#sendIconWrapper:hover &': {
    color: palette.themePrimary
  }
});
