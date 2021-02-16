// © Microsoft Corporation. All rights reserved.

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { useThread } from '../providers/ChatThreadProvider';
import { useUpdateThreadTopicName } from '../hooks/useUpdateThreadTopicName';

export type ChatTopicPropsFromContext = {
  existsTopicName: boolean | undefined;
  topicName: string;
  updateThreadTopicName: (topicName: string) => Promise<boolean>;
};

export const MapToChatTopicProps = (): ChatTopicPropsFromContext => {
  // use whatever hooks you need to use here
  // return back all of the props from context
  const thread = useThread();
  return {
    existsTopicName: !!thread && thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
    topicName: thread && thread.topic ? thread.topic : '',
    updateThreadTopicName: useUpdateThreadTopicName()
  };
};
