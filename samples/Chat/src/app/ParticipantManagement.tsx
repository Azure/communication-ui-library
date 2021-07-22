// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CommunicationParticipant, ParticipantItem } from '@azure/communication-react';
import { Stack, IContextualMenuItem } from '@fluentui/react';

export type ParticipantManagementProps = {
  userId: string;
  chatParticipants: CommunicationParticipant[];
  removeThreadParticipant: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ParticipantManagement = (props: ParticipantManagementProps): JSX.Element => {
  const { userId, chatParticipants, removeThreadParticipant, onRenderAvatar } = props;

  return (
    <Stack>
      {chatParticipants.map((participant) => {
        if (participant.displayName ?? participant.userId) {
          const menuItems: IContextualMenuItem[] = [];
          menuItems.push({
            key: 'Remove',
            text: 'Remove',
            onClick: () => {
              removeThreadParticipant?.(participant.userId).catch((error) => {
                console.error(error);
              });
            }
          });

          const me = participant.userId === (userId as string);

          return (
            <ParticipantItem
              key={participant.userId}
              displayName={participant.displayName as string}
              me={me}
              menuItems={me ? undefined : menuItems}
              onRenderAvatar={onRenderAvatar ? () => onRenderAvatar(participant.userId) : undefined}
            />
          );
        }
        return undefined;
      })}
    </Stack>
  );
};
