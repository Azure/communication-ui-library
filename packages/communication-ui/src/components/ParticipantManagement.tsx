// © Microsoft Corporation. All rights reserved.

import { ChatThreadMember } from '../types/ChatThreadMember';
import React, { useEffect } from 'react';
import MemberItem from './MemberItem';
import { connectFuncsToContext } from '../consumers/ConnectContext';
import { MapToChatThreadMemberProps } from '../consumers/MapToChatThreadMemberProps';
import { MapToUserIdProps } from '../consumers/MapToUserIdProps';
import { Stack } from '@fluentui/react';

export type ParticipantManagementProps = {
  userId: string;
  threadMembers: ChatThreadMember[];
  removeThreadMember?: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

/**
 * The removeThreadMember error flow is internal for now as it involves a custom logic with the ChatProvider Context
 * that I think is not easily use-able by customers. I think this needs to be revisited on how removeThreadMember error
 * system should be handled by customers implementing their own components.
 *
 * TODO: Remove this and replace with ErrorBar when we have it.
 */
type ParticipantManagementInternalProps = {
  removeThreadMemberError?: boolean;
  setRemoveThreadMemberError?: (removeThreadMemberError: boolean) => void;
};

export const ParticipantManagementComponent = (
  props: ParticipantManagementProps & ParticipantManagementInternalProps
): JSX.Element => {
  const {
    userId,
    threadMembers,
    removeThreadMember,
    onRenderAvatar,
    removeThreadMemberError,
    setRemoveThreadMemberError
  } = props;

  useEffect(() => {
    if (removeThreadMemberError && setRemoveThreadMemberError) {
      // TODO: When we define error system for components this should be removed to avoid using alerts in browser.
      alert("You can't remove participant at this time. Please wait at least 60 seconds to try again.");
      setRemoveThreadMemberError(false);
    }
  }, [removeThreadMemberError, setRemoveThreadMemberError]);

  return (
    <Stack>
      {threadMembers.map((member) => {
        if (member.displayName !== undefined) {
          return (
            <MemberItem
              key={member.userId}
              userId={member.userId}
              name={member.displayName as string}
              isYou={member.userId === (userId as string)}
              removeThreadMemberByUserId={removeThreadMember}
              onRenderAvatar={onRenderAvatar}
            />
          );
        }
        return undefined;
      })}
    </Stack>
  );
};

export default connectFuncsToContext(ParticipantManagementComponent, MapToChatThreadMemberProps, MapToUserIdProps);
