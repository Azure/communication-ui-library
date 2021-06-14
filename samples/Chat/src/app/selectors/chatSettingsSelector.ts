// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { existsTopicName } from '../utils/utils';
import { createSelector } from 'reselect';
import { getTopicName, getUserId } from './baseSelectors';
export const chatSettingsSelector = createSelector([getUserId, getTopicName], (userId, topicName) => {
  return {
    userId,
    topicName: existsTopicName(topicName) ? topicName : undefined
  };
});
