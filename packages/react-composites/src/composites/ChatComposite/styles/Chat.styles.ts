// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { MessageThreadStyles, SendBoxStylesProps, TypingIndicatorStylesProps } from '@internal/react-components';

const MESSAGE_THREAD_WIDTH = '41.25rem';

const chatScreenContainerStyle: IStyle = {
  height: '100%',
  width: '100%',
  minHeight: '20rem'
};

/**
 * @private
 */
export const chatScreenContainerStyleDesktop = mergeStyles({
  ...chatScreenContainerStyle,
  minWidth: '24.25rem'
});

/**
 * @private
 */
export const chatScreenContainerStyleMobile = mergeStyles({
  ...chatScreenContainerStyle,
  minWidth: '19.5rem'
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
  overflow: 'hidden'
});

/**
 * @private
 */
export const chatWrapper = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'auto'
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
export const participantListWrapper = mergeStyles({
  boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)',
  width: '20rem',
  // max width at 50% of view so the People Pane is not squeezing the Message Pane to almost nothing when on small screen or high zoom in
  maxWidth: '50vw',
  height: '100%'
});

/**
 * @private
 */
export const participantListContainerPadding = { childrenGap: '0.5rem' };

/**
 * @private
 */
export const listHeader = mergeStyles({
  fontSize: '1rem',
  margin: '1rem'
});

/**
 * @private
 */
export const participantListStack = mergeStyles({
  height: '100%'
});

/**
 * @private
 */
export const participantListStyle = mergeStyles({
  height: '100%',
  overflow: 'auto'
});

/**
 * @private
 */
export const sendBoxChatCompositeStyles: SendBoxStylesProps = {
  textFieldContainer: { maxWidth: MESSAGE_THREAD_WIDTH }
};

/**
 * @private
 */
export const messageThreadChatCompositeStyles: MessageThreadStyles = { root: { maxWidth: MESSAGE_THREAD_WIDTH } };

/**
 * @private
 */
export const typingIndicatorChatCompositeStyles: TypingIndicatorStylesProps = {
  typingString: { maxWidth: MESSAGE_THREAD_WIDTH }
};
