// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getTypingIndicators, getParticipants, getUserId, ChatBaseSelectorProps } from './baseSelectors';
import { createSelector } from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CommunicationParticipant } from '@internal/react-components';
import { MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS, PARTICIPANTS_THRESHOLD } from './utils/constants';
import { ChatClientState } from '@internal/chat-stateful-client';

const filterTypingIndicators = (
  typingIndicators: TypingIndicatorReceivedEvent[],
  userId: string
): TypingIndicatorReceivedEvent[] => {
  const filteredTypingIndicators: TypingIndicatorReceivedEvent[] = [];
  const seen = new Set();
  const date8SecondsAgo = new Date(Date.now() - MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS);
  const reversedTypingIndicators = [...typingIndicators].reverse();
  for (const typingIndicator of reversedTypingIndicators) {
    if (toFlatCommunicationIdentifier(typingIndicator.sender) === userId) {
      continue;
    }
    if (typingIndicator.receivedOn < date8SecondsAgo) {
      continue;
    }
    if (seen.has(toFlatCommunicationIdentifier(typingIndicator.sender))) {
      continue;
    }
    seen.add(toFlatCommunicationIdentifier(typingIndicator.sender));
    filteredTypingIndicators.push(typingIndicator);
  }
  return filteredTypingIndicators;
};

const convertSdkTypingIndicatorsToCommunicationParticipants = (
  typingIndicators: TypingIndicatorReceivedEvent[],
  participants: { [key: string]: ChatParticipant }
): CommunicationParticipant[] => {
  return typingIndicators.map((typingIndicator) => ({
    userId: toFlatCommunicationIdentifier(typingIndicator.sender),
    displayName: participants[toFlatCommunicationIdentifier(typingIndicator.sender)]?.displayName
  }));
};

/**
 * Selector type for {@link TypingIndicator} component.
 *
 * @public
 */
export type TypingIndicatorSelector = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
) => {
  typingUsers: CommunicationParticipant[];
};

/**
 * Selector for {@link TypingIndicator} component.
 *
 * @public
 */
export const typingIndicatorSelector: TypingIndicatorSelector = createSelector(
  [getTypingIndicators, getParticipants, getUserId],
  (
    typingIndicators: TypingIndicatorReceivedEvent[],
    participants: { [key: string]: ChatParticipant },
    userId: string
  ) => {
    // if the participant size reaches the threshold then return no typing users
    if (Object.values(participants).length >= PARTICIPANTS_THRESHOLD) {
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
