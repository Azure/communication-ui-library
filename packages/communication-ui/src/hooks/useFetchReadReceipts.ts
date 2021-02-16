// © Microsoft Corporation. All rights reserved.

import { ReadReceipt } from '@azure/communication-chat';
import { useCallback } from 'react';
import { useChatThreadClient } from '../providers/ChatThreadProvider';

export const useFetchReadReceipts = (): (() => Promise<ReadReceipt[]>) => {
  const chatThreadClient = useChatThreadClient();
  if (chatThreadClient === undefined) {
    throw new Error('thread client is not set up yet');
  }
  const fetchReadReceipts = useCallback(async (): Promise<ReadReceipt[]> => {
    const receipts: ReadReceipt[] = [];
    for await (const page of chatThreadClient.listReadReceipts().byPage()) {
      for (const receipt of page) {
        receipts.push(receipt);
      }
    }
    return receipts;
  }, [chatThreadClient]);
  return fetchReadReceipts;
};
