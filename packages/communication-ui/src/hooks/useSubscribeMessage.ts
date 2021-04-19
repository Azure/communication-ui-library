// © Microsoft Corporation. All rights reserved.

import { ChatMessage } from '@azure/communication-chat';
import { useCallback, useEffect } from 'react';

import { ChatMessageReceivedEvent } from '@azure/communication-signaling-2';
import { useUserId } from '../providers/ChatProvider';
import { useChatClient } from '../providers/ChatProviderHelper';
import { useSetChatMessages, useThreadId } from '../providers/ChatThreadProvider';

const subscribedTheadIdSet = new Set<string>();

export const useSubscribeMessage = (addMessage?: (messageEvent: ChatMessageReceivedEvent) => void): void => {
  const chatClient = useChatClient();
  const setChatMessages = useSetChatMessages();
  const threadId = useThreadId();
  const userId = useUserId();

  const defaultAddMessage = useCallback(
    (messageEvent: ChatMessageReceivedEvent) => {
      if (messageEvent.sender.user.communicationUserId !== userId) {
        // not user's own message
        setChatMessages((prevMessages) => {
          const messages: ChatMessage[] = prevMessages ? [...prevMessages] : [];
          const { threadId: _threadId, recipient: _recipient, ...newMessage } = {
            ...messageEvent,
            sender: { communicationUserId: messageEvent.sender.user.communicationUserId },
            content: { message: messageEvent.content },
            createdOn: new Date(messageEvent.createdOn),
            sequenceId: ''
          };
          messages.push(newMessage);
          return messages;
        });
      }
    },
    [setChatMessages, userId]
  );

  const onMessageReceived = useCallback(
    (event: ChatMessageReceivedEvent): void => {
      addMessage ? addMessage(event) : defaultAddMessage(event);
    },
    [addMessage, defaultAddMessage]
  );

  useEffect(() => {
    chatClient.on('chatMessageReceived', onMessageReceived);

    if (!addMessage && threadId && !subscribedTheadIdSet.has(threadId)) {
      subscribedTheadIdSet.add(threadId);
    }

    return () => {
      chatClient.off('chatMessageReceived', onMessageReceived);
      threadId && subscribedTheadIdSet.delete(threadId);
    };
  }, [chatClient, onMessageReceived, addMessage, threadId]);
};
