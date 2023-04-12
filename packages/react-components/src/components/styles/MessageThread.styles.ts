// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, mergeStyles, Theme } from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { CSSProperties } from 'react';
import { MESSAGE_STATUS_INDICATOR_SIZE_REM } from './MessageStatusIndicator.styles';

// Minimum chat bubble width. This matches the minimum chat bubble width from FluentUI
// that can contain a message and a timestamp.
const CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM = 6.25;

// Chat messages should span just short of the width of the container.
// When calculating the width of a message we also must take into account
// the width of the avatar/gutter and the gap between the message and avatar/gutter.
const AVATAR_WIDTH_REM = 2;
const AVATAR_MESSAGE_GAP_REM = 0.5;
const MESSAGE_AMOUNT_OUT_FROM_EDGE_REM = 2;

// Avatars should display on top of chat messages when the chat thread is narrow
const MESSAGE_AVATAR_OVERLAP_REM = 0.425;
const CHAT_MESSAGE_ZINDEX = 1;
const AVATAR_ZINDEX = 2;
// new message button should be on top of chat message
const NEW_MESSAGE_BUTTON_ZINDEX = 2;

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
  // This should match the size of the message status indicator icon to ensure
  // multiple messages sent by the user are aligned correctly.
  width: `${MESSAGE_STATUS_INDICATOR_SIZE_REM}rem`
});

/**
 * @private
 */
export const chatStyle: ComponentSlotStyle = {
  paddingBottom: '0.5rem',
  paddingTop: '0.8rem',
  border: 'none',
  overflow: 'auto',
  // `height: 100%` ensures that the Chat component covers 100% of it's parents height
  // to prevent intermittent scrollbars when gifs are present in the chat.
  height: '100%'
};

/**
 * @private
 */
export const newMessageButtonContainerStyle = mergeStyles({
  position: 'absolute',
  zIndex: NEW_MESSAGE_BUTTON_ZINDEX,
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
export const defaultChatItemMessageContainer = (overlapAvatarAndMessage: boolean): ComponentSlotStyle => {
  const messageAvatarGap = overlapAvatarAndMessage ? -MESSAGE_AVATAR_OVERLAP_REM : AVATAR_MESSAGE_GAP_REM;
  return {
    marginRight: '0rem',
    marginLeft: `${messageAvatarGap}rem`,
    width: `calc(100% - ${AVATAR_WIDTH_REM + MESSAGE_AMOUNT_OUT_FROM_EDGE_REM + messageAvatarGap}rem)`,
    zIndex: CHAT_MESSAGE_ZINDEX,
    '& msft-at-mention': {
      color: 'red'
    }
  };
};

/**
 * @private
 */
export const defaultMyChatMessageContainer: ComponentSlotStyle = {
  maxWidth: '100%',
  minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
  marginLeft: '0rem',
  // This makes message bubble show border in high contrast mode making each message distinguishable
  border: '1px solid transparent'
};

/**
 * @private
 */
export const FailedMyChatMessageContainer: ComponentSlotStyle = {
  ...defaultChatItemMessageContainer,
  backgroundColor: 'rgba(168, 0, 0, 0.2)'
};

/**
 * @private
 */
export const defaultChatMessageContainer = (theme: Theme): ComponentSlotStyle => ({
  maxWidth: '100%',
  minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
  marginRight: '0rem',
  '& img': {
    maxWidth: '100% !important', // Add !important to make sure it won't be overridden by style defined in element
    height: 'auto !important'
  },
  '& p': {
    // Deal with awkward padding seen in messages from Teams.
    // For more info see https://github.com/Azure/communication-ui-library/pull/1507
    marginBlock: '0.125rem'
  },
  '& blockquote': {
    backgroundColor: theme.palette.white,
    clear: 'left',
    minHeight: '2.25rem',
    width: 'fit-content',
    margin: '7px 0px',
    padding: '7px 15px',
    border: 'solid',
    borderRadius: '4px',
    borderWidth: '1px',
    borderColor: theme.palette.neutralQuaternary,
    borderLeftWidth: '4px'
  },
  '& table': {
    backgroundColor: theme.palette.white,
    border: theme.palette.neutralQuaternary,
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    width: '100%',

    '& tr': {
      border: `1px solid ${theme.palette.neutralQuaternary}`,

      '& td': {
        border: `1px solid ${theme.palette.neutralQuaternary}`,
        wordBreak: 'normal',
        padding: '0px 5px'
      }
    }
  },
  // This makes message bubble show border in high contrast mode making each message distinguishable
  border: '1px solid transparent'
});

/**
 * @private
 * @conditional-compile-remove(data-loss-prevention)
 */
export const defaultBlockedMessageStyleContainer = (theme: Theme): ComponentSlotStyle => ({
  maxWidth: '100%',
  minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
  marginRight: '0rem',
  color: theme.palette.neutralSecondary,

  '& i': {
    paddingTop: '0.25rem'
  },

  '& p': {
    // Deal with awkward padding seen in messages from Teams.
    // For more info see https://github.com/Azure/communication-ui-library/pull/1507
    marginBlock: '0.125rem',
    paddingRight: '0.75rem',
    fontStyle: 'italic'
  },

  '& a': {
    marginBlock: '0.125rem',
    fontStyle: 'normal',
    color: theme.palette.themePrimary,
    textDecoration: 'none'
  },
  // This makes message bubble show border in high contrast mode making each message distinguishable
  border: '1px solid transparent'
});

/**
 * @private
 */
export const gutterWithAvatar: ComponentSlotStyle = {
  width: `${AVATAR_WIDTH_REM}`,
  position: 'relative',
  float: 'left',
  display: 'block',
  visibility: 'visible',
  zIndex: AVATAR_ZINDEX
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
