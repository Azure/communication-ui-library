// © Microsoft Corporation. All rights reserved.

import { ChatThreadClient } from '@azure/communication-chat';
import { useCallback } from 'react';
import { useChatThreadClient } from '../providers/ChatThreadProvider';

export const useSendTypingNotification = (): (() => Promise<void>) => {
  const chatThreadClient: ChatThreadClient | undefined = useChatThreadClient();
  const sendTypingNotification = useCallback(async (): Promise<void> => {
    if (chatThreadClient === undefined) {
      console.error('thread client is not set up yet');
      return;
    }
    await chatThreadClient.sendTypingNotification();
  }, [chatThreadClient]);
  return sendTypingNotification;
};
