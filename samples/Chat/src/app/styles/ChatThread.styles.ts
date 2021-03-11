// © Microsoft Corporation. All rights reserved.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { mergeStyles } from '@fluentui/react';
import { CSSProperties } from 'react';

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

export const chatContainerStyle = mergeStyles({
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

export const chatHistoryDivStyle: CSSProperties = {
  minHeight: '2rem'
};

export const bottomRightPopupStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  bottom: 0,
  right: '1.5rem'
};

export const chatMessageStyle = (mine: boolean): ComponentSlotStyle => ({
  backgroundColor: mine ? 'rgba(42, 161,255, 0.25)' : 'rgba(243,242,241)',
  overflowY: 'hidden'
});

export const readReceiptStyle = (mine: boolean): string =>
  mergeStyles({
    marginLeft: mine ? '1rem' : '0rem'
  });

export const newMessageButtonStyle = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

export const loadMoreMessageButtonStyle = mergeStyles({
  minHeight: '1.5rem'
});

export const DownIconStyle = mergeStyles({
  marginRight: '0.5em'
});
