import { createSelector } from 'reselect';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { ChatParticipant } from '@azure/communication-chat';
import { getUserId, getDisplayName, getParticipants } from './baseSelectors';

export type WebUiChatParticipant = {
  userId: string;
  displayName?: string;
};

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatParticipant[]): WebUiChatParticipant[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatParticipant) => {
    return {
      userId: sdkThreadMember.user.communicationUserId,
      displayName: sdkThreadMember.displayName
    };
  });
};

export const participantListSelector = createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<string, ChatParticipant>, displayName) => {
    return {
      userId,
      displayName,
      participants: convertSdkThreadMembersToChatThreadMembers(Array.from(chatParticipants.values()))
    };
  }
);
