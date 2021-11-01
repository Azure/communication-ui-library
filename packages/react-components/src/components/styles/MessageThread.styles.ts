// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CSSProperties } from 'react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { IButtonStyles, mergeStyles } from '@fluentui/react';

// Minimum chat bubble width. This matches the minimum chat bubble width from FluentUI
// that can contain a message and a timestamp.
const CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM = 6.25;

// Chat messages should span just short of the width of the container.
// When calculating the width of a message we also must take into account
// the width of the avatar/gutter and the gap between the message and avatar/gutter.
const AVATAR_WIDTH_REM = 2;
const AVATAR_MESSAGE_GAP_REM = 0.5;
const MESSAGE_AMOUNT_OUT_FROM_EDGE_REM = 2;

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
export const defaultChatItemMessageContainer: ComponentSlotStyle = {
  marginRight: '0rem',
  marginLeft: `${AVATAR_MESSAGE_GAP_REM}rem`,
  width: `calc(100% - ${AVATAR_WIDTH_REM + MESSAGE_AMOUNT_OUT_FROM_EDGE_REM + AVATAR_MESSAGE_GAP_REM}rem)`
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
  width: `${AVATAR_WIDTH_REM}`,
  position: 'relative',
  float: 'left',
  display: 'block',
  visibility: 'visible'
};

/**
 * @private
 */
export const gutterWithHiddenAvatar: ComponentSlotStyle = {
  ...gutterWithAvatar,
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
