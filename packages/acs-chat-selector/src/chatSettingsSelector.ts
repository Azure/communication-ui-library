// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
import * as reselect from 'reselect';
// @ts-ignore
import { BaseSelectorProps, getExistsTopicName, getParticipants, getTopicName, getUserId } from './baseSelectors';
import { existsTopicName } from './utils/existsTopicName';

export const chatSettingsSelector = reselect.createSelector([getUserId, getTopicName], (userId, topicName) => {
  return {
    userId,
    topicName: existsTopicName(topicName) ? topicName : undefined
  };
});
