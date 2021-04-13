// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps, getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { WebUiChatParticipant } from './types/WebUiChatParticipant';

const convertParticipantsToWebUiChatParticipants = (participants: ChatParticipant[]): WebUiChatParticipant[] => {
  return participants.map((participant: ChatParticipant) => {
    return {
      userId: participant.user.communicationUserId,
      displayName: participant.displayName
    };
  });
};

export const participantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<string, ChatParticipant>, displayName) => {
    return {
      userId,
      displayName,
      participants: convertParticipantsToWebUiChatParticipants(Array.from(chatParticipants.values()))
    };
  }
);
