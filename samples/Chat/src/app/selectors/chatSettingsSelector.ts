// © Microsoft Corporation. All rights reserved.

import { existsTopicName } from 'app/utils/utils';
import { createSelector } from 'reselect';
import { getTopicName, getUserId } from './baseSelectors';
export const chatSettingsSelector = createSelector([getUserId, getTopicName], (userId, topicName) => {
  return {
    userId,
    topicName: existsTopicName(topicName) ? topicName : undefined
  };
});
