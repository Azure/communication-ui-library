// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GUID_FOR_INITIAL_TOPIC_NAME } from './constants';

export const existsTopicName = (topicName?: string): boolean =>
  !!topicName && topicName !== GUID_FOR_INITIAL_TOPIC_NAME;
