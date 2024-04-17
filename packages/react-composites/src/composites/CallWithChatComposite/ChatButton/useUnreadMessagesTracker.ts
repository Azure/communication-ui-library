// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useState } from 'react';
import { ChatMessage } from '@azure/communication-chat';
import { CallWithChatAdapter } from '../adapter/CallWithChatAdapter';

/**
 * Used by the CallWithChatComposite to track unread messages for showing as a badge on the Chat Button.
 * @private
 */
export const useUnreadMessagesTracker = (
  callWithChatAdapter: CallWithChatAdapter,
  isChatPaneVisible: boolean
): number => {
  // Store messageIds of unread messages
  const [unreadChatMessages, setUnreadChatMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Clear unread messages when chat pane is opened
    if (isChatPaneVisible) {
      setUnreadChatMessages(new Set());
      return;
    }

    // Increment unread messages when a new message is received and the chat pane is closed
    const incrementUnreadChatMessagesCount = (event: { message: ChatMessage }): void => {
      if (!isChatPaneVisible && validNewChatMessage(event.message)) {
        setUnreadChatMessages((prevUnreadChatMessages) => {
          const newUnreadChatMessages = new Set(prevUnreadChatMessages);
          newUnreadChatMessages.add(event.message.id);
          return newUnreadChatMessages;
        });
      }
    };

    // Decrement unread messages when a message is deleted and the chat pane is closed
    const decrementUnreadChatMessagesCount = (event: { message: ChatMessage }): void => {
      if (!isChatPaneVisible) {
        setUnreadChatMessages((prevUnreadChatMessages) => {
          const newUnreadChatMessages = new Set(prevUnreadChatMessages);
          newUnreadChatMessages.delete(event.message.id);
          return newUnreadChatMessages;
        });
      }
    };

    if (callWithChatAdapter.isChatAdapterInitialized()) {
      console.log('ChatAdapter is already initialized');
      callWithChatAdapter.on('messageReceived', incrementUnreadChatMessagesCount);
      callWithChatAdapter.on('messageDeleted', decrementUnreadChatMessagesCount);
    } else {
      console.log('ChatAdapter is not initialized yet. Waiting for chatInitialized event.');
      callWithChatAdapter.on('chatInitialized', (chatAdapter) => {
        console.log('ChatAdapter is connected. Subscribing to messageReceived and messageDeleted events');
        callWithChatAdapter.on('messageReceived', incrementUnreadChatMessagesCount);
        callWithChatAdapter.on('messageDeleted', decrementUnreadChatMessagesCount);
      });
    }

    return () => {
      callWithChatAdapter.off('messageReceived', incrementUnreadChatMessagesCount);
      callWithChatAdapter.off('messageDeleted', decrementUnreadChatMessagesCount);
    };
  }, [callWithChatAdapter, setUnreadChatMessages, isChatPaneVisible]);

  return unreadChatMessages.size;
};

/**
 * Helper function to determine if the message in the event is a valid one from a user.
 * Display name is used since system messages will not have one.
 */
const validNewChatMessage = (message: ChatMessage): boolean =>
  !!message.senderDisplayName && (message.type === 'text' || message.type === 'html');
