// © Microsoft Corporation. All rights reserved.

import { ChatThreadMember } from '../types/ChatThreadMember';
import { useCallback } from 'react';
import { useUserId } from '../providers/ChatProvider';
import { useChatClient } from '../providers/ChatProviderHelper';
import {
  useChatThreadClient,
  useSetThreadMembers,
  useSetUpdateThreadMembersError,
  useThreadId,
  useSetGetThreadMembersError
} from '../providers/ChatThreadProvider';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

// TODO: A lot of the code here is specific to Sample App such as the 'setThreadMembersError' which is used to show
// the 'you have been removed' screen in Sample App. This file requires some refactoring.
export const useFetchThreadMembers = (): (() => Promise<void>) => {
  const chatThreadClient = useChatThreadClient();
  const setUpdateThreadMembersError = useSetUpdateThreadMembersError();
  const setThreadMembers = useSetThreadMembers();
  const setThreadMembersError = useSetGetThreadMembersError();
  const chatClient = useChatClient();
  const threadId = useThreadId();
  const userId = useUserId();
  if (chatThreadClient === undefined) {
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const useFetchThreadMembersInternal = useCallback(async (): Promise<void> => {
    const threadMembers: ChatThreadMember[] = [];
    const getThreadMembersResponse = chatThreadClient.listMembers();
    for await (const threadMember of getThreadMembersResponse) {
      // TODO: fix typescript error
      threadMembers.push(threadMember as any);
    }
    if (threadMembers.length === 0) {
      console.error('unable to get members in the thread');
      setUpdateThreadMembersError(true);

      // If we get 0 members it could mean that the user was removed from thread. To confirm we get the chat thread
      // and see if user is in the members there. Note that this behavior is kind of weird and may get broken in the
      // future. The reason for that is why are we allowed to get members from getThread but not allowed to get
      // members from listMembers? That seems inconsistent behavior. We will be following up with the SDK team to get
      // clarity.
      if (threadId !== undefined) {
        try {
          const thread = await chatClient.getChatThread(threadId);
          if (thread !== undefined && thread.members !== undefined) {
            if (thread.members.find((member) => member.user.communicationUserId === userId) === undefined) {
              // This triggers the error page to display
              setThreadMembersError(true);
            }
          }
        } catch (error) {
          console.error('unable to get thread', error);
          // If we get an error here we expect its network error or some other unhandled error. We have no way to handle
          // it here so we let it through. This entire callback will get called again later which lets us retry the call
        }
      }
      return;
    }

    // TODO: fix typescript error
    setThreadMembers(threadMembers as any);
  }, [
    chatClient,
    chatThreadClient,
    setThreadMembers,
    setThreadMembersError,
    setUpdateThreadMembersError,
    threadId,
    userId
  ]);
  return useFetchThreadMembersInternal;
};
