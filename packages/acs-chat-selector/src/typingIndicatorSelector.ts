// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps, getTypingIndicators, getParticipants, getUserId } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { TypingIndicator } from '@azure/acs-chat-declarative';
import { WebUiChatParticipant } from './types/WebUiChatParticipant';
import {
  MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS,
  PARTICIPANTS_THRESHOLD,
  UNKNOWN_DISPLAYNAME
} from './utils/constants';

const filterTypingIndicators = (typingIndicators: TypingIndicator[], userId: string): TypingIndicator[] => {
  const filteredTypingIndicators: TypingIndicator[] = [];
  const seen = new Set();
  const date8SecondsAgo = new Date(Date.now() - MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS);
  for (let i = typingIndicators.length - 1; i >= 0; i--) {
    const typingIndicator = typingIndicators[i];
    if (typingIndicator.sender.user.communicationUserId === userId) {
      continue;
    }
    if (typingIndicator.receivedOn < date8SecondsAgo) {
      // assuming typingIndicators is ordered from oldest to newest so we don't need to check the rest
      break;
    }
    if (seen.has(typingIndicator.sender.user.communicationUserId)) {
      continue;
    }
    seen.add(typingIndicator.sender.user.communicationUserId);
    filteredTypingIndicators.push(typingIndicator);
  }
  return filteredTypingIndicators;
};

const convertSdkTypingIndicatorsToWebUiChatParticipants = (
  typingIndicators: TypingIndicator[],
  participants: Map<string, ChatParticipant>
): WebUiChatParticipant[] => {
  return typingIndicators.map((typingIndicator) => ({
    userId: typingIndicator.sender.user.communicationUserId,
    displayName: participants.get(typingIndicator.sender.user.communicationUserId)?.displayName ?? UNKNOWN_DISPLAYNAME
  }));
};

export const typingIndicatorSelector = reselect.createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (typingIndicators: TypingIndicator[], participants: Map<string, ChatParticipant>, userId: string) => {
    // if the participant size reaches the threshold then return no typing users
    if (participants.size >= PARTICIPANTS_THRESHOLD) {
      return { typingUsers: [] };
    }

    // filter typing indicators to remove those that are from the duplicate users or current user as well as those older than a threshold
    const filteredTypingIndicators = filterTypingIndicators(typingIndicators, userId);

    const typingUsers: WebUiChatParticipant[] = convertSdkTypingIndicatorsToWebUiChatParticipants(
      filteredTypingIndicators,
      participants
    );

    return { typingUsers };
  }
);
