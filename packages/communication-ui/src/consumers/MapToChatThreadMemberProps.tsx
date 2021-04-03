// © Microsoft Corporation. All rights reserved.
import { ChatParticipant } from '@azure/communication-chat';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';
import { useThreadMembers } from '../providers/ChatThreadProvider';
import { ChatParticipant as WebUiChatThreadMember } from '../types/ChatParticipant';

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatParticipant[]): WebUiChatThreadMember[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatParticipant) => {
    return {
      userId: sdkThreadMember.user.communicationUserId,
      displayName: sdkThreadMember.displayName
    };
  });
};

export type ChatThreadMemberPropsFromContext = {
  threadMembers: WebUiChatThreadMember[];
  removeThreadMember?: (userId: string) => Promise<void>;
};

export const MapToChatThreadMemberProps = (): ChatThreadMemberPropsFromContext => {
  return {
    threadMembers: convertSdkThreadMembersToChatThreadMembers(useThreadMembers()),
    removeThreadMember: useRemoveThreadMember()
  };
};
