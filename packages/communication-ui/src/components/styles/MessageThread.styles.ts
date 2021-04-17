// © Microsoft Corporation. All rights reserved.

import { CSSProperties } from 'react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { mergeStyles } from '@fluentui/react';

export const messageAvatarContainerStyle = (backgroundColor: string): string =>
  mergeStyles({
    width: '2rem',
    minWidth: '2rem',
    height: '2rem',
    backgroundColor: backgroundColor,
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Segoe UI Regular',
    fontSize: '1rem' // 16px
  });

export const messageThreadContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative'
});

export const noReadReceiptStyle = mergeStyles({
  width: '1rem'
});

export const chatStyle: ComponentSlotStyle = {
  paddingBottom: '0.5rem',
  border: 'none',
  overflow: 'auto'
};

export const loadPreviousMessagesButtonContainerStyle = mergeStyles({
  minHeight: '2rem',
  display: 'flex',
  justifyContent: 'center'
});

export const newMessageButtonContainerStyle = mergeStyles({
  position: 'absolute',
  zIndex: 1,
  bottom: 0,
  right: '1.5rem'
});

export const chatMessageStyle: CSSProperties = {
  overflowY: 'hidden'
};

export const readReceiptContainerStyle = (mine: boolean): string =>
  mergeStyles({
    marginLeft: mine ? '1rem' : '0rem'
  });

export const newMessageButtonStyle = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

export const loadPreviousMessageButtonStyle = mergeStyles({
  border: 'none',
  minHeight: '1.5rem',
  selectors: {
    '&:hover': { background: 'none' },
    '&:active': { background: 'none' }
  }
});

export const DownIconStyle = mergeStyles({
  marginRight: '0.5em'
});
