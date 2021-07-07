// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';
const theme = getTheme();
const palette = theme.palette;

export const incomingCallToastStyle = mergeStyles({
  minWidth: '20rem',
  width: '100%',
  height: '100%',
  backgroundColor: palette.whiteTranslucent40,
  opacity: 0.95,
  borderRadius: '0.5rem',
  boxShadow: theme.effects.elevation8,
  padding: '1rem'
});

export const incomingCallToastAvatarContainerStyle = mergeStyles({
  marginRight: '0.5rem'
});

export const incomingCallAcceptButtonStyle = mergeStyles({
  backgroundColor: palette.greenDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  padding: 'none',
  ':hover, :active': {
    backgroundColor: palette.green,
    color: palette.white
  }
});

export const incomingCallRejectButtonStyle = mergeStyles({
  backgroundColor: palette.redDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  padding: 'none',
  ':hover, :active': {
    backgroundColor: palette.red,
    color: palette.white
  }
});

export const incomingCallModalContainerStyle = {
  borderRadius: '0.75rem'
};

export const incomingCallModalLocalPreviewStyle = mergeStyles({
  height: '10rem',
  background: palette.neutralLighterAlt,
  margin: '1.5rem 0',
  borderRadius: '0.25rem',
  '& video': {
    borderRadius: '0.25rem'
  }
});
