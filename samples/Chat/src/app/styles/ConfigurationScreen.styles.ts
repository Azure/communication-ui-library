// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBackgroundColor } from '../utils/utils';
import { mergeStyles } from '@fluentui/react';

export const responsiveLayoutStyle = mergeStyles({
  display: 'flex',
  flexDirection: 'row',
  '@media (max-width: 37.5em)': {
    flexDirection: 'column'
  }
});

export const leftPreviewContainerStyle = mergeStyles({
  height: '10.563em',
  width: '8.313em',
  marginRight: '9.688em',
  '@media (max-width: 37.5em)': {
    marginRight: '0em'
  }
});

export const rightInputContainerStyle = mergeStyles({
  height: '14.75em',
  width: '19em',
  '@media (max-width: 37.5em)': {
    marginTop: '6.25em'
  }
});

export const smallAvatarContainerStyle = (avatar: string, selectedAvatar: string): string =>
  mergeStyles({
    width: '3em',
    height: '3em',
    border: avatar === selectedAvatar ? '0.125em solid #0378D4' : '',
    backgroundColor: getBackgroundColor(avatar)?.backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    outline: 'none'
  });

export const largeAvatarContainerStyle = (avatar: string): string =>
  mergeStyles({
    width: '8.25em',
    height: '8.25em',
    backgroundColor: getBackgroundColor(avatar)?.backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  });

export const smallAvatarStyle = mergeStyles({
  height: '1.75em',
  width: '2em',
  color: '#444444',
  fontWeight: 400,
  fontSize: '1.5em',
  letterSpacing: '0',
  lineHeight: '1.75em',
  textAlign: 'center'
});

export const largeAvatarStyle = mergeStyles({
  height: '4.938em',
  color: '#444444',
  fontWeight: 400,
  fontSize: '3.75em', // 60px
  letterSpacing: '0',
  lineHeight: '4.938em',
  textAlign: 'center'
});

export const namePreviewStyle = (isEmpty: boolean): string => {
  return mergeStyles({
    height: '1.5em',
    width: '8.313em',
    fontSize: '1.125em', // 18px
    fontWeight: 600,
    letterSpacing: '0',
    lineHeight: '1.5em',
    textAlign: 'center',
    opacity: isEmpty ? 1 : 0.34,
    wordWrap: 'break-word',
    overflowY: 'hidden'
  });
};

export const labelFontStyle = mergeStyles({
  height: '1.188em',
  fontSize: '1em', // 16px
  fontWeight: 600,
  letterSpacing: '0',
  lineHeight: '2em',
  marginBottom: '0.625em'
});

export const chatIconStyle = mergeStyles({
  marginRight: '0.375em',
  fontSize: '0.875em' // 14px
});

export const buttonStyle = mergeStyles({
  height: '2.75em',
  fontWeight: 600,
  width: '100%',
  maxWidth: '18.75em',
  minWidth: '12.5em',
  fontSize: '0.875em' // 14px
});

export const mainContainerStyle = mergeStyles({
  maxWidth: '46.875em',
  width: '100%',
  height: '100%',
  '@media (max-width: 46.875em)': {
    padding: '0.625em',
    height: '100%'
  }
});

export const startChatButtonTextStyle = mergeStyles({
  fontSize: '0.875em' // 14px
});
