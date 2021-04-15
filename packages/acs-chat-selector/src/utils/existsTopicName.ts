import { Constants } from '../constants';

export const existsTopicName = (topicName?: string): boolean =>
  !!topicName && topicName !== Constants.GUID_FOR_INITIAL_TOPIC_NAME;
