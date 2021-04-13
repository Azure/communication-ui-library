// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { WebUiChatParticipant, ParticipantItem, propagateError } from '@azure/communication-ui';
import { Stack, IContextualMenuItem } from '@fluentui/react';

export type ParticipantManagementProps = {
  userId: string;
  chatParticipants: WebUiChatParticipant[];
  removeThreadMember: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ParticipantManagement = (props: ParticipantManagementProps): JSX.Element => {
  const { userId, chatParticipants, removeThreadMember, onRenderAvatar } = props;

  return (
    <Stack>
      {chatParticipants.map((member) => {
        if (member.displayName !== undefined) {
          const menuItems: IContextualMenuItem[] = [];
          menuItems.push({
            key: 'Remove',
            text: 'Remove',
            onClick: () => {
              removeThreadMember?.(member.userId).catch((error) => {
                propagateError(error);
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
