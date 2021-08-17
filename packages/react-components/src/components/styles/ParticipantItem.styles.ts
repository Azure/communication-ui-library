// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const participantItemContainerStyle = mergeStyles({
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  display: 'flex',
  flexFlow: 'row-reverse',
  maxWidth: '20rem',
  minWidth: '12rem',
  cursor: 'pointer',
  alignItems: 'center'
});

export const participantItemNameStyle = mergeStyles({
  fontSize: '0.875rem', // 14px
  fontWeight: 400,
  marginTop: '0.3125rem',
  marginRight: '0.25rem',
  paddingLeft: '0.25rem',
  overflowY: 'hidden'
});

export const participantItemMeStyle = mergeStyles({
  fontSize: '0.875rem', // 14px
  fontWeight: 400,
  color: '#A19F9D',
  marginTop: '0.3125rem'
});

export const iconContainerStyle = mergeStyles({
  display: 'flex',
  right: '1rem',
  alignItems: 'center'
});
