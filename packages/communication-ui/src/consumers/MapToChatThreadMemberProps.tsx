// © Microsoft Corporation. All rights reserved.
import { ChatParticipant } from '@azure/communication-chat';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';
import { useThreadMembers } from '../providers/ChatThreadProvider';
import { WebUiChatParticipant } from '../types/WebUiChatParticipant';

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatParticipant[]): WebUiChatParticipant[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatParticipant) => {
    return {
      userId: sdkThreadMember.user.communicationUserId,
      displayName: sdkThreadMember.displayName
    };
  });
};

export type ChatThreadMemberPropsFromContext = {
  threadMembers: WebUiChatParticipant[];
  removeThreadMember?: (userId: string) => Promise<void>;
};

export const MapToChatThreadMemberProps = (): ChatThreadMemberPropsFromContext => {
  return {
    threadMembers: convertSdkThreadMembersToChatThreadMembers(useThreadMembers()),
    removeThreadMember: useRemoveThreadMember()
  };
};
