// © Microsoft Corporation. All rights reserved.

import { useCallback, useEffect } from 'react';

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { useChatClient } from '../providers/ChatProvider';

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
    async (event: TypingIndicatorReceivedEvent): Promise<void> => {
      const notification: TypingNotification = {
        from: event.sender.communicationUserId,
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
    const subscribeForTypingIndicator = async (): Promise<void> => {
      chatClient.on('typingIndicatorReceived', onTypingIndicatorReceived);
    };

    subscribeForTypingIndicator();
    return () => {
      chatClient.off('typingIndicatorReceived', onTypingIndicatorReceived);
    };
  }, [chatClient, onTypingIndicatorReceived]);

  return;
};
