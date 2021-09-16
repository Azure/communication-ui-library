// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CSSProperties } from 'react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { mergeStyles } from '@fluentui/react';

export const messageAvatarContainerStyle = (backgroundColor: string): string =>
  mergeStyles({
    width: '2em',
    minWidth: '2em',
    height: '2em',
    backgroundColor: backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Segoe UI Regular',
    fontSize: '1em' // 16px
  });

export const messageThreadContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative'
});

export const noMessageStatusStyle = mergeStyles({
  width: '1.25em'
});

export const chatStyle: ComponentSlotStyle = {
  paddingBottom: '0.5em',
  paddingTop: '0.8em',
  border: 'none',
  overflow: 'auto'
};

export const newMessageButtonContainerStyle = mergeStyles({
  position: 'absolute',
  zIndex: 1,
  bottom: 0,
  right: '1.5em'
});

export const chatMessageStyle: CSSProperties = {
  overflowY: 'hidden'
};

export const chatMessageDateStyle: CSSProperties = {
  fontWeight: 600
};

export const messageStatusContainerStyle = (mine: boolean): string =>
  mergeStyles({
    marginLeft: mine ? '1em' : '0em'
  });

export const newMessageButtonStyle = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

export const loadPreviousMessageButtonStyle = mergeStyles({
  border: 'none',
  minHeight: '1.5em',
  '&:hover': { background: 'none' },
  '&:active': { background: 'none' }
});

export const DownIconStyle = mergeStyles({
  marginRight: '0.5em'
});
