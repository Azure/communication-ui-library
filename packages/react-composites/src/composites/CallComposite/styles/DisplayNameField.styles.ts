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
  height: '2.5em',
  width: '18.75em',
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

export const inputBoxWarningStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5em',
  width: '18.75em',
  borderRadius: '2px',
  fontSize: '0.875em'
});

export const labelFontStyle = mergeStyles({
  fontSize: '0.875em',
  fontWeight: 600,
  boxSizing: 'border-box',
  boxShadow: 'none',
  margin: 0,
  display: 'inline-block',
  padding: '5px 0px',
  overflowWrap: 'break-word'
});

export const warningStyle = mergeStyles({
  width: '18.75em',
  marginTop: '0.188em',
  marginBottom: '0.188em',
  marginLeft: '0.188em',
  color: '#e81123',
  fontSize: '.7375em',
  fontWeight: '400',
  position: 'absolute'
});
