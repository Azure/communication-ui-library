// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { ChatClientState } from 'chat-stateful-client';
import { CommunicationIdentifierAsKey, getCommunicationIdentifierAsKey } from 'chat-stateful-client';
// @ts-ignore
import { ChatBaseSelectorProps } from './baseSelectors';
import { getTypingIndicators, getParticipants, getUserId } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { FlatCommunicationIdentifier, flattenedCommunicationIdentifier } from 'acs-ui-common';
import { CommunicationParticipant } from 'react-components';
import { MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS, PARTICIPANTS_THRESHOLD } from './utils/constants';

const filterTypingIndicators = (
  typingIndicators: TypingIndicatorReceivedEvent[],
  userId: FlatCommunicationIdentifier
): TypingIndicatorReceivedEvent[] => {
  const filteredTypingIndicators: TypingIndicatorReceivedEvent[] = [];
  const seen = new Set();
  const date8SecondsAgo = new Date(Date.now() - MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS);
  for (let i = typingIndicators.length - 1; i >= 0; i--) {
    const typingIndicator = typingIndicators[i];
    if (flattenedCommunicationIdentifier(typingIndicator.sender) === userId) {
      continue;
    }
    if (typingIndicator.receivedOn < date8SecondsAgo) {
      continue;
    }
    if (seen.has(getCommunicationIdentifierAsKey(typingIndicator.sender))) {
      continue;
    }
    seen.add(getCommunicationIdentifierAsKey(typingIndicator.sender));
    filteredTypingIndicators.push(typingIndicator);
  }
  return filteredTypingIndicators;
};

const convertSdkTypingIndicatorsToCommunicationParticipants = (
  typingIndicators: TypingIndicatorReceivedEvent[],
  participants: Map<string, ChatParticipant>
): CommunicationParticipant[] => {
  return typingIndicators.map((typingIndicator) => ({
    userId: flattenedCommunicationIdentifier(typingIndicator.sender),
    displayName: participants.get(getCommunicationIdentifierAsKey(typingIndicator.sender))?.displayName
  }));
};

export const typingIndicatorSelector = reselect.createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (
    typingIndicators: TypingIndicatorReceivedEvent[],
    participants: Map<CommunicationIdentifierAsKey, ChatParticipant>,
    userId: string
  ) => {
    // if the participant size reaches the threshold then return no typing users
    if (participants.size >= PARTICIPANTS_THRESHOLD) {
      return { typingUsers: [] };
    }

    // filter typing indicators to remove those that are from the duplicate users or current user as well as those older than a threshold
    const filteredTypingIndicators = filterTypingIndicators(typingIndicators, userId);

    const typingUsers: CommunicationParticipant[] = convertSdkTypingIndicatorsToCommunicationParticipants(
      filteredTypingIndicators,
      participants
    );

    return { typingUsers };
  }
);
