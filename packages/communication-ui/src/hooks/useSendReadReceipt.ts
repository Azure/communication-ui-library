// © Microsoft Corporation. All rights reserved.
import { ChatThreadClient, SendReadReceiptRequest } from '@azure/communication-chat';
import { useCallback } from 'react';
import { useChatThreadClient } from '../providers/ChatThreadProvider';

export const useSendReadReceipt = (): ((messageId: string) => Promise<void>) => {
  const chatThreadClient: ChatThreadClient | undefined = useChatThreadClient();
  const sendReadReceipt = useCallback(
    async (messageId: string): Promise<void> => {
      if (chatThreadClient === undefined) {
        console.error('thread client is not set up yet');
        return;
      }
      const postReadReceiptRequest: SendReadReceiptRequest = {
        chatMessageId: messageId
      };
      await chatThreadClient.sendReadReceipt(postReadReceiptRequest);
    },
    [chatThreadClient]
  );
  return sendReadReceipt;
};
