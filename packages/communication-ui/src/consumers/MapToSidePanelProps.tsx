// © Microsoft Corporation. All rights reserved.

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { ChatThread, ChatThreadMember } from '@azure/communication-chat';
import {
  useGetThreadMembersError,
  useSetGetThreadMembersError,
  useThread,
  useThreadMembers
} from '../providers/ChatThreadProvider';
import { useUpdateThreadTopicName } from '../hooks/useUpdateThreadTopicName';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';

export type SidePanelPropsFromContext = {
  threadMembers: ChatThreadMember[];
  thread: ChatThread | undefined;
  existsTopicName: boolean | undefined;
  removeThreadMemberError: boolean | undefined;
  updateThreadTopicName: (topicName: string) => Promise<boolean>;
  removeThreadMemberByUserId: (userId: string) => void;
  setRemoveThreadMemberError: (getThreadMembersError: boolean) => void;
};

export const MapToSidePanelProps = (): SidePanelPropsFromContext => {
  // use whatever hooks you need to use here
  // return back all of the props from context
  const thread = useThread();
  const threadMembers = useThreadMembers();
  const getThreadMembersError = useGetThreadMembersError();
  const setRemoveThreadMemberError = useSetGetThreadMembersError();
  return {
    threadMembers: threadMembers,
    thread: thread,
    existsTopicName: thread && thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
    removeThreadMemberError: getThreadMembersError,
    updateThreadTopicName: useUpdateThreadTopicName(),
    removeThreadMemberByUserId: useRemoveThreadMember(),
    setRemoveThreadMemberError: setRemoveThreadMemberError
  };
};
