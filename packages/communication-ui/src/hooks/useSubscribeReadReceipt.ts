// © Microsoft Corporation. All rights reserved.

import { useCallback, useEffect } from 'react';

import { ReadReceipt } from '@azure/communication-chat';
import { useChatClient } from '../providers/ChatProvider';
import { useFetchReadReceipts } from './useFetchReadReceipts';
import { useSetReceipts, useThreadId } from '../providers/ChatThreadProvider';

const subscribedTheadIdSet = new Set<string>();

export const useSubscribeReadReceipt = (addReadReceipts?: (readReceipts: ReadReceipt[]) => void): void => {
  const chatClient = useChatClient();
  const fetchReadReceipts = useFetchReadReceipts();
  const setReceipts = useSetReceipts();
  const threadId = useThreadId();

  const defaultAddReadReceipts = useCallback(
    (readReceipts: ReadReceipt[]) => {
      setReceipts(readReceipts);
    },
    [setReceipts]
  );

  const onReadReceiptReceived = useCallback(
    async (/*event: ReadReceiptReceivedEvent*/): Promise<void> => {
      // TODO: update to using readReceipt instead of readReceipts[]:
      // const _readReceipt: ReadReceipt = {
      //   sender: event.sender,
      //   chatMessageId: event.chatMessageId,
      //   readOn: new Date(event.readOn)
      // };
      const readReceipts: ReadReceipt[] = await fetchReadReceipts();
      addReadReceipts ? addReadReceipts(readReceipts) : defaultAddReadReceipts(readReceipts);
    },
    [addReadReceipts, fetchReadReceipts, defaultAddReadReceipts]
  );

  useEffect(() => {
    const subscribeReadReceipt = async (): Promise<void> => {
      chatClient.on('readReceiptReceived', onReadReceiptReceived);
    };

    if (addReadReceipts) {
      subscribeReadReceipt();
    } else if (threadId && !subscribedTheadIdSet.has(threadId)) {
      subscribeReadReceipt();
      subscribedTheadIdSet.add(threadId);
    }

    return () => {
      chatClient.off('readReceiptReceived', onReadReceiptReceived);
      threadId && subscribedTheadIdSet.delete(threadId);
    };
  }, [addReadReceipts, chatClient, onReadReceiptReceived, threadId]);

  return;
};
