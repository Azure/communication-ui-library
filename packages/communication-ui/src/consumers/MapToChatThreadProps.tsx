// © Microsoft Corporation. All rights reserved.

import { ChatThread } from '@azure/communication-chat';
import { useThread } from '../providers/ChatThreadProvider';

import { useFetchThread } from '../hooks/useFetchThread';
import { useSendTypingNotification } from '../hooks/useSendTypingNotification';
import { useUpdateThreadTopicName } from '../hooks/useUpdateThreadTopicName';
import { useEffect } from 'react';
import { useFetchThreadMembers } from '../hooks/useFetchThreadMembers';
import { THREAD_INFO_FETCH_INVERVAL } from '../constants';
import { useUserId } from '../providers/ChatProvider';

export type ChatThreadPropsFromContext = {
  userId: string;
  thread: ChatThread | undefined;
  sendTypingNotification: () => void;
  getThread: () => void;
  updateThreadTopicName: (topicName: string) => Promise<boolean>;
};

export const MapToChatThreadProps = (): ChatThreadPropsFromContext => {
  const thread = useThread();
  const fetchThread = useFetchThread();
  const fetchThreadMembers = useFetchThreadMembers();

  useEffect(() => {
    // We call the fetch immediately the first time instead of waiting for THREAD_INFO_FETCH_INVERVAL.
    fetchThread();
    fetchThreadMembers();
  }, [fetchThread, fetchThreadMembers]);

  return {
    userId: useUserId(),
    thread: thread,
    sendTypingNotification: useSendTypingNotification(),
    getThread: useFetchThread(),
    updateThreadTopicName: useUpdateThreadTopicName()
  };
};
