// © Microsoft Corporation. All rights reserved.

import { ChatThreadMember } from '../types/ChatThreadMember';
import React from 'react';
import MemberItem from './MemberItem';
import { connectFuncsToContext } from '../consumers/ConnectContext';
import { MapToChatThreadMemberProps } from '../consumers/MapToChatThreadMemberProps';
import { MapToUserIdProps } from '../consumers/MapToUserIdProps';
import { Stack } from '@fluentui/react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../providers/ErrorProvider';

export type ParticipantManagementProps = {
  userId: string;
  threadMembers: ChatThreadMember[];
  removeThreadMember?: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

const ParticipantManagementComponentBase = (props: ParticipantManagementProps & ErrorHandlingProps): JSX.Element => {
  const { userId, threadMembers, removeThreadMember, onRenderAvatar } = props;

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

export const ParticipantManagementComponent = (props: ParticipantManagementProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ParticipantManagementComponentBase, props);

export default connectFuncsToContext(ParticipantManagementComponent, MapToChatThreadMemberProps, MapToUserIdProps);
