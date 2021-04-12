// © Microsoft Corporation. All rights reserved.

import { ChatParticipant } from '@azure/communication-chat';
import { useCallback } from 'react';
import {
  useChatThreadClient,
  useSetThreadMembers,
  useSetUpdateThreadMembersError
} from '../providers/ChatThreadProvider';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

// TODO: A lot of the code here is specific to Sample App such as the 'setThreadMembersError' which is used to show
// the 'you have been removed' screen in Sample App. This file requires some refactoring.
export const useFetchThreadMembers = (): (() => Promise<void>) => {
  const chatThreadClient = useChatThreadClient();
  const setUpdateThreadMembersError = useSetUpdateThreadMembersError();
  const setThreadMembers = useSetThreadMembers();

  if (chatThreadClient === undefined) {
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const useFetchThreadMembersInternal = useCallback(async (): Promise<void> => {
    const threadMembers: ChatParticipant[] = [];
    const getThreadMembersResponse = chatThreadClient.listParticipants();
    for await (const threadMember of getThreadMembersResponse) {
      // TODO: fix typescript error
      threadMembers.push(threadMember);
    }
    if (threadMembers.length === 0) {
      console.error('unable to get members in the thread');
      setUpdateThreadMembersError(true);
      return;
    }

    // TODO: fix typescript error
    setThreadMembers(threadMembers as any);
  }, [chatThreadClient, setThreadMembers, setUpdateThreadMembersError]);
  return useFetchThreadMembersInternal;
};
