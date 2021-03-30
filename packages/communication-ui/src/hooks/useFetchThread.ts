// © Microsoft Corporation. All rights reserved.

import { useSetThread, useThreadId } from '../providers/ChatThreadProvider';
import { useChatClient } from '../providers/ChatProviderHelper';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

export const useFetchThread = (): (() => Promise<void>) => {
  const chatClient = useChatClient();
  const threadId = useThreadId();
  if (threadId === undefined) {
    throw new CommunicationUiError({
      message: 'ThreadId is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const setThread = useSetThread();
  const useFetchThreadInternal = useCallback(async (): Promise<void> => {
    try {
      const thread = await chatClient.getChatThread(threadId);
      setThread(thread);
    } catch (error) {
      throw new CommunicationUiError({
        message: 'Error getting chat thread',
        code: CommunicationUiErrorCode.CONFIGURATION_ERROR,
        error: error
      });
    }
  }, [chatClient, threadId, setThread]);
  return useFetchThreadInternal;
};
