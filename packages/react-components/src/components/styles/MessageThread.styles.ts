// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CSSProperties } from 'react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { IButtonStyles, mergeStyles } from '@fluentui/react';

// Minimum chat bubble width. This matches the minimum chat bubble width from FluentUI
// that can contain a message and a timestamp.
const CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM = 6.25;

/**
 * @private
 */
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

/**
 * @private
 */
export const messageThreadContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative',
  alignSelf: 'center'
});

/**
 * @private
 */
export const noMessageStatusStyle = mergeStyles({
  width: '1.25rem'
});

/**
 * @private
 */
export const chatStyle: ComponentSlotStyle = {
  paddingBottom: '0.5rem',
  paddingTop: '0.8rem',
  border: 'none',
  overflow: 'auto'
};

/**
 * @private
 */
export const newMessageButtonContainerStyle = mergeStyles({
  position: 'absolute',
  zIndex: 1,
  bottom: 0,
  right: '1.5rem'
});

/**
 * @private
 */
export const chatMessageStyle: CSSProperties = {
  overflowY: 'hidden'
};

/**
 * @private
 */
export const chatMessageDateStyle: CSSProperties = {
  fontWeight: 600
};

/**
 * @private
 */
export const defaultMyChatItemMessageContainer: ComponentSlotStyle = {
  marginRight: '0rem',
  marginLeft: '0rem'
};

/**
 * @private
 */
export const defaultChatItemMessageContainer: ComponentSlotStyle = {
  marginRight: '0rem',
  marginLeft: '0rem'
};

/**
 * @private
 */
export const defaultMyChatMessageContainer: ComponentSlotStyle = {
  maxWidth: '100%',
  minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
  marginLeft: '0rem'
};

/**
 * @private
 */
export const defaultChatMessageContainer: ComponentSlotStyle = {
  maxWidth: '100%',
  minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
  marginRight: '0rem'
};

/**
 * @private
 */
export const gutterWithAvatar: ComponentSlotStyle = {
  position: 'relative',
  float: 'left',
  display: 'block',
  visibility: 'visible'
};

/**
 * @private
 */
export const gutterWithHiddenAvatar: ComponentSlotStyle = {
  position: 'relative',
  float: 'left',
  display: 'block',
  visibility: 'hidden',
  // we use this hidden avatar just as a width placeholder
  // the placeholder is needed for responsive bubble width
  height: 0
};

/**
 * @private
 */
export const messageStatusContainerStyle = (mine: boolean): string =>
  mergeStyles({
    marginLeft: mine ? '0.25rem' : '0rem'
  });

/**
 * @private
 */
export const newMessageButtonStyle = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

/**
 * @private
 */
export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const loadPreviousMessageButtonStyle = mergeStyles({
  border: 'none',
  minHeight: '1.5rem',
  '&:hover': { background: 'none' },
  '&:active': { background: 'none' }
});

/**
 * @private
 */
export const DownIconStyle = mergeStyles({
  marginRight: '0.5em'
});
