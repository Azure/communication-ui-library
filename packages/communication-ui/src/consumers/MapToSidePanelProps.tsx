// © Microsoft Corporation. All rights reserved.

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { ChatThread, ChatParticipant } from '@azure/communication-chat';
import { useThread, useThreadMembers } from '../providers/ChatThreadProvider';
import { useUpdateThreadTopicName } from '../hooks/useUpdateThreadTopicName';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';

export type SidePanelPropsFromContext = {
  threadMembers: ChatParticipant[];
  thread: ChatThread | undefined;
  existsTopicName: boolean | undefined;
  updateThreadTopicName: (topicName: string) => Promise<boolean>;
  removeThreadMemberByUserId: (userId: string) => void;
};

export const MapToSidePanelProps = (): SidePanelPropsFromContext => {
  // use whatever hooks you need to use here
  // return back all of the props from context
  const thread = useThread();
  const threadMembers = useThreadMembers();
  return {
    threadMembers: threadMembers,
    thread: thread,
    existsTopicName: thread && thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
    updateThreadTopicName: useUpdateThreadTopicName(),
    removeThreadMemberByUserId: useRemoveThreadMember()
  };
};
