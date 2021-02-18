// © Microsoft Corporation. All rights reserved.
import { ChatThreadMember } from '@azure/communication-chat';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';
import { useThreadMembers } from '../providers/ChatThreadProvider';
import { ChatThreadMember as WebUiChatThreadMember } from '../types/ChatThreadMember';

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatThreadMember[]): WebUiChatThreadMember[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatThreadMember) => {
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
