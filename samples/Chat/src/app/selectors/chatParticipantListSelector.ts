// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import {
  toFlatCommunicationIdentifier,
  ChatClientState,
  ChatBaseSelectorProps,
  CommunicationParticipant
} from '@azure/communication-react';
import { ChatParticipant } from '@azure/communication-chat';

const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);
const getDisplayName = (state: ChatClientState): string => state.displayName;
const getParticipants = (state: ChatClientState, props: ChatBaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

const convertChatParticipantsToCommunicationParticipants = (
  chatParticipants: ChatParticipant[]
): CommunicationParticipant[] => {
  return chatParticipants.map((participant: ChatParticipant) => {
    return {
      userId: toFlatCommunicationIdentifier(participant.id),
      displayName: participant.displayName
    };
  });
};

export const chatParticipantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<string, ChatParticipant>, displayName) => {
    return {
      myUserId: userId,
      displayName,
      participants: convertChatParticipantsToCommunicationParticipants(Array.from(chatParticipants.values()))
    };
  }
);
