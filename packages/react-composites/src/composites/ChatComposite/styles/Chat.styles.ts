// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const chatContainer = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  minHeight: '25rem',
  minWidth: '25rem'
});

export const chatArea = mergeStyles({
  height: '100%',
  width: '100%',
  paddingBottom: '1rem',
  overflow: 'hidden'
});

export const chatWrapper = mergeStyles({
  height: '100%',
  width: '100%',
  paddingBottom: '1rem',
  overflow: 'auto'
});

export const chatHeaderContainerStyle = mergeStyles({
  width: '100%',
  height: 'auto',
  paddingLeft: '3.25rem',
  paddingRight: '3.25rem',
  marginTop: '1rem',
  selectors: {
    '@media (max-width: 65rem)': {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  },
  borderBottom: '0.063rem solid #DDDDDD'
});

export const topicNameLabelStyle = mergeStyles({
  fontSize: '1rem', // 16px
  fontWeight: 600,
  marginRight: '0.125rem',
  textOverflow: 'ellipsis',
  overflowY: 'hidden'
});
