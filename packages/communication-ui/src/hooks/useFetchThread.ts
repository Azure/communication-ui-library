// © Microsoft Corporation. All rights reserved.

import { useSetThread, useThreadId } from '../providers/ChatThreadProvider';
import { useChatClient } from '../providers/ChatProvider';
import { useCallback } from 'react';

export const useFetchThread = (): (() => Promise<void>) => {
  const chatClient = useChatClient();
  const threadId = useThreadId();
  if (threadId === undefined) {
    throw new Error('Thread Id not created yet');
  }
  const setThread = useSetThread();
  const useFetchThreadInternal = useCallback(async (): Promise<void> => {
    const thread = await chatClient.getChatThread(threadId);
    setThread(thread);
  }, [chatClient, threadId, setThread]);
  return useFetchThreadInternal;
};
