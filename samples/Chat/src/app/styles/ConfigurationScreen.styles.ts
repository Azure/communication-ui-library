// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getBackgroundColor } from '../utils/utils';
import { mergeStyles } from '@fluentui/react';

export const responsiveLayoutStyle = mergeStyles({
  display: 'flex',
  flexDirection: 'row',
  '@media (max-width: 37.5rem)': {
    flexDirection: 'column'
  }
});

export const leftPreviewContainerStyle = mergeStyles({
  height: '10.563rem',
  width: '8.313rem',
  marginRight: '9.688rem',
  '@media (max-width: 37.5rem)': {
    marginRight: '0rem'
  }
});

export const rightInputContainerStyle = mergeStyles({
  height: '14.75rem',
  width: '19rem',
  '@media (max-width: 37.5rem)': {
    marginTop: '6.25rem'
  }
});

export const smallAvatarContainerStyle = (avatar: string, selectedAvatar: string): string =>
  mergeStyles({
    width: '3rem',
    height: '3rem',
    border: avatar === selectedAvatar ? '0.125rem solid #0378D4' : '',
    backgroundColor: getBackgroundColor(avatar)?.backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    outline: 'none'
  });

export const largeAvatarContainerStyle = (avatar: string): string =>
  mergeStyles({
    width: '8.25rem',
    height: '8.25rem',
    backgroundColor: getBackgroundColor(avatar)?.backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  });

export const smallAvatarStyle = mergeStyles({
  height: '1.75rem',
  width: '2rem',
  color: '#444444',
  fontWeight: 400,
  fontSize: '1.5rem',
  letterSpacing: '0',
  lineHeight: '1.75rem',
  textAlign: 'center'
});

export const largeAvatarStyle = mergeStyles({
  height: '4.938rem',
  color: '#444444',
  fontWeight: 400,
  fontSize: '3.75rem', // 60px
  letterSpacing: '0',
  lineHeight: '4.938rem',
  textAlign: 'center'
});

export const namePreviewStyle = (isEmpty: boolean): string => {
  return mergeStyles({
    height: '1.5rem',
    width: '8.313rem',
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    letterSpacing: '0',
    lineHeight: '1.5rem',
    textAlign: 'center',
    opacity: isEmpty ? 1 : 0.34,
    wordWrap: 'break-word',
    overflowY: 'hidden'
  });
};

export const labelFontStyle = mergeStyles({
  height: '1.188rem',
  fontSize: '1rem', // 16px
  fontWeight: 600,
  letterSpacing: '0',
  lineHeight: '2rem',
  marginBottom: '0.625rem'
});

export const chatIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '0.875rem' // 14px
});

export const buttonStyle = mergeStyles({
  height: '2.75rem',
  fontWeight: 600,
  width: '100%',
  maxWidth: '18.75rem',
  minWidth: '12.5rem',
  fontSize: '0.875rem' // 14px
});

export const mainContainerStyle = mergeStyles({
  maxWidth: '46.875rem',
  width: '100%',
  height: '100%',
  '@media (max-width: 46.875rem)': {
    padding: '0.625rem',
    height: '100%'
  }
});

export const startChatButtonTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});
