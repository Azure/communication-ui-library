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
  root: {
    '&:hover': { background: 'none' },
    '&:active': { background: 'none' }
  }
});

export const iconContainerStyle = mergeStyles({
  display: 'flex',
  alignItems: 'center',
  height: '100%'
});

export const iconStyles = mergeStyles({ display: 'flex', margin: 'auto' });
