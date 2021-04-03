// © Microsoft Corporation. All rights reserved.

import { useCallback, useEffect } from 'react';

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling-2';
import { useChatClient } from '../providers/ChatProviderHelper';

export type TypingNotification = {
  from: string;
  originalArrivalTime: number;
  recipientId: string;
  threadId: string;
  version: string;
};

export type TypingNotifications = { [id: string]: TypingNotification };

export const useSubscribeTypingNotification = (
  addTypingNotifications: (notification: TypingNotification) => void
): void => {
  const chatClient = useChatClient();

  const onTypingIndicatorReceived = useCallback(
    (event: TypingIndicatorReceivedEvent): void => {
      const notification: TypingNotification = {
        from: event.sender.user.communicationUserId,
        originalArrivalTime: Date.parse(event.receivedOn),
        recipientId: event.recipient.communicationUserId,
        threadId: event.threadId,
        version: event.version
      };
      addTypingNotifications(notification);
    },
    [addTypingNotifications]
  );

  useEffect(() => {
    chatClient.on('typingIndicatorReceived', onTypingIndicatorReceived);
    return () => {
      chatClient.off('typingIndicatorReceived', onTypingIndicatorReceived);
    };
  }, [chatClient, onTypingIndicatorReceived]);

  return;
};
