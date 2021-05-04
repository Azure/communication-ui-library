// © Microsoft Corporation. All rights reserved.

import { GUID_FOR_INITIAL_TOPIC_NAME } from '@azure/react-components';
export const existsTopicName = (topicName?: string): boolean =>
  !!topicName && topicName !== GUID_FOR_INITIAL_TOPIC_NAME;
