// © Microsoft Corporation. All rights reserved.

import React from 'react';
import {
  WebUiChatParticipant,
  ParticipantItem,
  connectFuncsToContext,
  MapToChatThreadMemberProps,
  MapToUserIdProps,
  WithErrorHandling,
  ErrorHandlingProps,
  propagateError
} from '@azure/communication-ui';
import { Stack, IContextualMenuItem } from '@fluentui/react';

export type ParticipantManagementProps = {
  userId: string;
  threadMembers: WebUiChatParticipant[];
  removeThreadMember?: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

const ParticipantManagementComponentBase = (props: ParticipantManagementProps & ErrorHandlingProps): JSX.Element => {
  const { userId, threadMembers, removeThreadMember, onRenderAvatar, onErrorCallback } = props;

  return (
    <Stack>
      {threadMembers.map((member) => {
        if (member.displayName !== undefined) {
          const menuItems: IContextualMenuItem[] = [];
          menuItems.push({
            key: 'Remove',
            text: 'Remove',
            onClick: () => {
              removeThreadMember?.(member.userId).catch((error) => {
                propagateError(error, onErrorCallback);
              });
            }
          });

          const isYou = member.userId === (userId as string);

          return (
            <ParticipantItem
              key={member.userId}
              name={member.displayName as string}
              isYou={isYou}
              menuItems={isYou ? undefined : menuItems}
              onRenderAvatar={onRenderAvatar ? () => onRenderAvatar(member.userId) : undefined}
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
