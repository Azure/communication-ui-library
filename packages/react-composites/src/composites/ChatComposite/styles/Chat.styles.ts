// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, memoizeFunction, mergeStyles } from '@fluentui/react';
import { MessageThreadStyles } from '@internal/react-components';

const MESSAGE_THREAD_WIDTH = '41.25rem';

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
  minHeight: '13rem',
  minWidth: '17.5rem'
});

/**
 * @private
 */
export const chatContainer = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'hidden',

  '*::-webkit-scrollbar': {
    width: '0.3rem',
    height: '0.3rem'
  },
  '.scroll::-webkit-scrollbar-track': {
    background: 'rgba(150, 150, 150)',
    borderRadius: '0.3rem'
  },
  '*::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: 'rgba(150, 150, 150)'
  }
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
  overflow: 'hidden',
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
    root: { maxWidth: MESSAGE_THREAD_WIDTH },
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
  maxWidth: MESSAGE_THREAD_WIDTH,
  width: '100%',
  alignSelf: 'center'
};
