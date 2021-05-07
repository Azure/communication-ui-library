// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
import { CommunicationIdentifierAsKey, communicationIdentifierAsKey } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { communicationIdentifierToString, getTypingIndicators, getParticipants, getUserId } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { TypingIndicator } from '@azure/acs-chat-declarative';
import { WebUiChatParticipant } from './types/WebUiChatParticipant';
import { MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS, PARTICIPANTS_THRESHOLD } from './utils/constants';

const filterTypingIndicators = (typingIndicators: TypingIndicator[], userId: string): TypingIndicator[] => {
  const filteredTypingIndicators: TypingIndicator[] = [];
  const seen = new Set();
  const date8SecondsAgo = new Date(Date.now() - MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS);
  for (let i = typingIndicators.length - 1; i >= 0; i--) {
    const typingIndicator = typingIndicators[i];
    if (communicationIdentifierToString(typingIndicator.sender) === userId) {
      continue;
    }
    if (typingIndicator.receivedOn < date8SecondsAgo) {
      continue;
    }
    if (seen.has(communicationIdentifierAsKey(typingIndicator.sender))) {
      continue;
    }
    seen.add(communicationIdentifierAsKey(typingIndicator.sender));
    filteredTypingIndicators.push(typingIndicator);
  }
  return filteredTypingIndicators;
};

const convertSdkTypingIndicatorsToWebUiChatParticipants = (
  typingIndicators: TypingIndicator[],
  participants: Map<string, ChatParticipant>
): WebUiChatParticipant[] => {
  return typingIndicators.map((typingIndicator) => ({
    userId: communicationIdentifierToString(typingIndicator.sender),
    displayName: participants.get(communicationIdentifierAsKey(typingIndicator.sender))?.displayName
  }));
};

export const typingIndicatorSelector = reselect.createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (
    typingIndicators: TypingIndicator[],
    participants: Map<CommunicationIdentifierAsKey, ChatParticipant>,
    userId: string
  ) => {
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
