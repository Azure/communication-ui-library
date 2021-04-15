// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
import * as reselect from 'reselect';
// @ts-ignore
import { BaseSelectorProps, getExistsTopicName, getTopicName, getUserId } from './baseSelectors';

export const chatHeaderSelector = reselect.createSelector([getUserId, getTopicName], (userId, topicName) => {
  return {
    userId,
    topicName
  };
});
