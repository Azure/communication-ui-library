// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps, getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { WebUiChatParticipant } from './types/WebUiChatParticipant';

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatParticipant[]): WebUiChatParticipant[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatParticipant) => {
    return {
      userId: sdkThreadMember.user.communicationUserId,
      displayName: sdkThreadMember.displayName
    };
  });
};

export const participantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<string, ChatParticipant>, displayName) => {
    return {
      userId,
      displayName,
      participants: convertSdkThreadMembersToChatThreadMembers(Array.from(chatParticipants.values()))
    };
  }
);
