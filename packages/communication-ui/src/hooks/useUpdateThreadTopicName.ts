// © Microsoft Corporation. All rights reserved.
import { useCallback } from 'react';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity
} from '../types/CommunicationUiError';
import { getErrorFromAcsResponseCode } from '../utils/SDKUtils';
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
      let res;
      try {
        res = await threadClient.updateThread(updateThreadRequest);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error updating thread',
          code: CommunicationUiErrorCode.UPDATE_THREAD_ERROR,
          severity: CommunicationUiErrorSeverity.WARNING,
          error: error
        });
      }
      if (res._response.status === OK) {
        try {
          const thread = await chatClient.getChatThread(threadId);
          setThread(thread);
        } catch (error) {
          throw new CommunicationUiError({
            message: 'Error getting thread',
            code: CommunicationUiErrorCode.GET_THREAD_ERROR,
            severity: CommunicationUiErrorSeverity.WARNING
          });
        }
      } else {
        const error = getErrorFromAcsResponseCode('Error updating thread, status code: ', res._response.status);
        if (error) {
          throw error;
        }
      }
      return true;
    },
    [chatClient, setThread, threadClient, threadId]
  );
  return useUpdateThreadTopicNameInternal;
};
