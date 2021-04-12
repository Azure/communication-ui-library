// © Microsoft Corporation. All rights reserved.

import { useChatThreadClient } from '../providers/ChatThreadProvider';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { getErrorFromAcsResponseCode } from '../utils/SDKUtils';

export const useRemoveThreadMember = (): ((userId: string) => Promise<void>) => {
  const chatThreadClient = useChatThreadClient();
  const useRemoveThreadMemberInternal = useCallback(
    async (userId: string): Promise<void> => {
      if (chatThreadClient === undefined) {
        throw new CommunicationUiError({
          message: 'ChatThreadClient is undefined',
          code: CommunicationUiErrorCode.CONFIGURATION_ERROR
        });
      }
      let response;
      try {
        response = await chatThreadClient.removeParticipant({
          communicationUserId: userId
        });
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error removing thread member',
          code: CommunicationUiErrorCode.REMOVE_THREAD_MEMBER_ERROR,
          error: error
        });
      }
      const error = getErrorFromAcsResponseCode(
        'Error removing thread member, status code: ',
        response._response.status
      );
      if (error) {
        throw error;
      }
    },
    [chatThreadClient]
  );
  return useRemoveThreadMemberInternal;
};
