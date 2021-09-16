// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';
const theme = getTheme();
const palette = theme.palette;

export const incomingCallToastStyle = mergeStyles({
  minWidth: '20em',
  width: '100%',
  height: '100%',
  backgroundColor: palette.whiteTranslucent40,
  opacity: 0.95,
  borderRadius: '0.5em',
  boxShadow: theme.effects.elevation8,
  padding: '1em'
});

export const incomingCallToastAvatarContainerStyle = mergeStyles({
  marginRight: '0.5em'
});

export const incomingCallAcceptButtonStyle = mergeStyles({
  backgroundColor: palette.greenDark,
  color: palette.white,
  borderRadius: '2em',
  minWidth: '2em',
  width: '2em',
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
  borderRadius: '2em',
  minWidth: '2em',
  width: '2em',
  border: 'none',
  padding: 'none',
  ':hover, :active': {
    backgroundColor: palette.red,
    color: palette.white
  }
});

export const incomingCallModalContainerStyle = {
  borderRadius: '0.75em'
};

export const incomingCallModalLocalPreviewStyle = mergeStyles({
  height: '10em',
  background: palette.neutralLighterAlt,
  margin: '1.5em 0',
  borderRadius: '0.25em',
  '& video': {
    borderRadius: '0.25em'
  }
});
