// © Microsoft Corporation. All rights reserved.

import { useChatThreadClient, useSetUpdateThreadMembersError } from '../providers/ChatThreadProvider';
import { TOO_MANY_REQUESTS_STATUS_CODE } from '../constants';
import { useCallback } from 'react';

export const useRemoveThreadMember = (): ((userId: string) => Promise<void>) => {
  const chatThreadClient = useChatThreadClient();
  const setUpdateThreadMemberError = useSetUpdateThreadMembersError();
  const useRemoveThreadMemberInternal = useCallback(
    async (userId: string): Promise<void> => {
      if (chatThreadClient === undefined) {
        throw new Error('thread client is not set up yet');
      }
      const response = await chatThreadClient.removeMember({
        communicationUserId: userId
      });
      if (response._response.status === TOO_MANY_REQUESTS_STATUS_CODE) {
        setUpdateThreadMemberError(true);
      }
    },
    [chatThreadClient, setUpdateThreadMemberError]
  );
  return useRemoveThreadMemberInternal;
};
