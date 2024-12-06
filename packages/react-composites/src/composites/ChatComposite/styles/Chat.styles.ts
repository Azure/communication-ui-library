// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, memoizeFunction, mergeStyles } from '@fluentui/react';
import { MessageThreadStyles } from '@internal/react-components';
import { CHAT_CONTAINER_MIN_WIDTH_REM } from '../../common/constants';

const CHAT_CONTAINER_MAX_WIDTH_REM = 41.25;
const CHAT_CONTAINER_MIN_HEIGHT_REM = 13;

/**
 * @private
 * z-index to ensure that chat container has lower z-index than participant pane
 */
export const CHAT_CONTAINER_ZINDEX = 1;

/**
 * @private
 */
export const chatScreenContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  minHeight: `${CHAT_CONTAINER_MIN_HEIGHT_REM}rem`,
  minWidth: `${CHAT_CONTAINER_MIN_WIDTH_REM}rem`
});

/**
 * @private
 */
export const chatContainer = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'hidden'
});

/**
 * @private
 */
export const chatArea = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'auto',
  position: 'relative' // Ensure that the absolute children components are positioned relative to the chat area
});

/**
 * @private
 */
export const chatWrapper = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'visible',
  zIndex: CHAT_CONTAINER_ZINDEX
});

/**
 * @private
 */
export const chatHeaderContainerStyle = mergeStyles({
  width: '100%',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  '@media screen and (max-width: 25rem)': {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  borderBottom: '0.063rem solid #DDDDDD'
});

/**
 * @private
 */
export const topicNameLabelStyle = mergeStyles({
  fontSize: '1.1rem',
  lineHeight: '2.5rem',
  fontWeight: 600,
  marginRight: '0.125rem',
  textOverflow: 'ellipsis',
  overflowY: 'hidden'
});

/**
 * @private
 */
export const messageThreadChatCompositeStyles = memoizeFunction(
  (background: string): MessageThreadStyles => ({
    root: { maxWidth: `${CHAT_CONTAINER_MAX_WIDTH_REM}rem` },
    chatContainer: { background: background }
  })
);

/**
 * @private
 */
export const typingIndicatorContainerStyles: IStyle = {
  padding: '0rem 0.25rem'
};

/**
 * @private
 */
export const sendboxContainerStyles: IStyle = {
  maxWidth: `${CHAT_CONTAINER_MAX_WIDTH_REM}rem`,
  width: '100%',
  alignSelf: 'center'
};
