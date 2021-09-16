// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const participantItemContainerStyle = mergeStyles({
  paddingTop: '0.25em',
  paddingBottom: '0.25em',
  display: 'flex',
  maxWidth: '20em',
  minWidth: '12em',
  cursor: 'pointer',
  alignItems: 'center'
});

export const menuButtonContainerStyle = {
  width: '1.5em'
};

export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingTop: '0.2em'
};

export const iconStyles = mergeStyles({
  display: 'flex',
  lineHeight: 0, // ensure the icon center is on the center line and not slightly above it
  alignItems: 'center'
});

export const meContainerStyle = {
  paddingRight: '0.5em'
};
