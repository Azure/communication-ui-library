// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CommunicationParticipant, ParticipantItem } from 'react-components';
import { propagateError } from 'react-composites';
import { Stack, IContextualMenuItem } from '@fluentui/react';

export type ParticipantManagementProps = {
  userId: string;
  chatParticipants: CommunicationParticipant[];
  removeThreadMember: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ParticipantManagement = (props: ParticipantManagementProps): JSX.Element => {
  const { userId, chatParticipants, removeThreadMember, onRenderAvatar } = props;

  return (
    <Stack>
      {chatParticipants.map((member) => {
        if (member.displayName ?? member.userId) {
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
              name={(member.displayName as string) || member.userId}
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
