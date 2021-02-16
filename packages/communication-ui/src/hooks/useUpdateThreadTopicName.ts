// © Microsoft Corporation. All rights reserved.
import { useCallback } from 'react';
import { OK } from '../constants';
import { useChatClient } from '../providers/ChatProvider';
import { useChatThreadClient, useSetThread, useThreadId } from '../providers/ChatThreadProvider';

export const useUpdateThreadTopicName = (): ((topicName: string) => Promise<boolean>) => {
  const threadId = useThreadId();
  const chatClient = useChatClient();
  const threadClient = useChatThreadClient();
  const setThread = useSetThread();
  const useUpdateThreadTopicNameInternal = useCallback(
    async (topicName: string): Promise<boolean> => {
      if (threadClient === undefined) {
        console.error('threadClient is undefined');
        return false;
      }
      if (threadId === undefined) {
        console.log('threadId is undefined');
        return false;
      }
      const updateThreadRequest = {
        topic: topicName
      };
      const res = await threadClient.updateThread(updateThreadRequest);
      if (res._response.status === OK) {
        const thread = await chatClient.getChatThread(threadId);
        setThread(thread);
      }
      return true;
    },
    [chatClient, setThread, threadClient, threadId]
  );
  return useUpdateThreadTopicNameInternal;
};
