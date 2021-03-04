// © Microsoft Corporation. All rights reserved.

import React from 'react';
import {
  ChatThreadMember,
  MemberItem,
  connectFuncsToContext,
  MapToChatThreadMemberProps,
  MapToUserIdProps,
  WithErrorHandling,
  ErrorHandlingProps
} from '@azure/communication-ui';
import { Stack } from '@fluentui/react';

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

export const ParticipantManagement = connectFuncsToContext(
  ParticipantManagementComponent,
  MapToChatThreadMemberProps,
  MapToUserIdProps
);
