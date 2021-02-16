// © Microsoft Corporation. All rights reserved.
import { ChatThreadMember } from '@azure/communication-chat';
import { useRemoveThreadMember } from '../hooks/useRemoveThreadMember';
import {
  useRemoveThreadMemberError,
  useSetRemoveThreadMemberError,
  useThreadMembers
} from '../providers/ChatThreadProvider';
import { ChatThreadMember as WebUiChatThreadMember } from '../types/ChatThreadMember';

const convertSdkThreadMembersToChatThreadMembers = (sdkThreadMembers: ChatThreadMember[]): WebUiChatThreadMember[] => {
  return sdkThreadMembers.map((sdkThreadMember: ChatThreadMember) => {
    return {
      userId: sdkThreadMember.user.communicationUserId,
      displayName: sdkThreadMember.displayName
    };
  });
};

/**
 * RemoveThreadMember related props is marked as optional even though it is specified in the Map so it matches the
 * component's props type definition. At the component level (if customer is passing in their own props) the
 * removeThreadMember props are optional as not everyone will want to implement removeThreadMember.
 */
export type ChatThreadMemberPropsFromContext = {
  threadMembers: WebUiChatThreadMember[];
  removeThreadMemberError?: boolean;
  removeThreadMember?: (userId: string) => Promise<void>;
  setRemoveThreadMemberError?: (removeThreadMemberError: boolean) => void;
};

export const MapToChatThreadMemberProps = (): ChatThreadMemberPropsFromContext => {
  return {
    threadMembers: convertSdkThreadMembersToChatThreadMembers(useThreadMembers()),
    removeThreadMemberError: useRemoveThreadMemberError(),
    removeThreadMember: useRemoveThreadMember(),
    setRemoveThreadMemberError: useSetRemoveThreadMemberError()
  };
};
