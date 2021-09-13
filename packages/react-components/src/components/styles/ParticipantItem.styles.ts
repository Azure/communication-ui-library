// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const participantItemContainerStyle = mergeStyles({
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  display: 'flex',
  maxWidth: '20rem',
  minWidth: '12rem',
  cursor: 'pointer',
  alignItems: 'center'
});

export const menuButtonContainerStyle = mergeStyles({
  paddingTop: '0.25rem'
});

export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: '5.5rem'
};

export const iconStyles = mergeStyles({
  display: 'flex',
  lineHeight: 0,
  alignItems: 'center'
});
