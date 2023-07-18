// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useState } from 'react';
import { ChatAdapter } from '../../ChatComposite/adapter/ChatAdapter';
import { ChatMessage } from '@azure/communication-chat';

/**
 * Used by the CallWithChatComposite to track unread messages for showing as a badge on the Chat Button.
 * @private
 */
export const useUnreadMessagesTracker = (chatAdapter: ChatAdapter, isChatPaneVisible: boolean): number => {
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);

  useEffect(() => {
    if (isChatPaneVisible) {
      setUnreadChatMessagesCount(0);
      return;
    }
    const incrementUnreadChatMessagesCount = (event: { message: ChatMessage }): void => {
      if (!isChatPaneVisible && validNewChatMessage(event.message)) {
        setUnreadChatMessagesCount(unreadChatMessagesCount + 1);
      }
    };
    chatAdapter.on('messageReceived', incrementUnreadChatMessagesCount);

    return () => {
      chatAdapter.off('messageReceived', incrementUnreadChatMessagesCount);
    };
  }, [chatAdapter, setUnreadChatMessagesCount, isChatPaneVisible, unreadChatMessagesCount]);

  return unreadChatMessagesCount;
};

/**
 * Helper function to determine if the message in the event is a valid one from a user.
 * Display name is used since system messages will not have one.
 */
const validNewChatMessage = (message): boolean =>
  !!message.senderDisplayName && (message.type === 'text' || message.type === 'html');
