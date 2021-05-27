// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { IContextualMenuItem, Stack, PersonaPresence } from '@fluentui/react';
import { ParticipantItem } from './ParticipantItem';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { participantListStyle } from './styles/ParticipantList.styles';
import { CommunicationParticipant, CallParticipant } from '../types';

/**
 * Props for component `ParticipantList`
 */
export type ParticipantListProps = {
  /** Participants in user call or chat */
  participants: CommunicationParticipant[];
  /** User ID of user */
  myUserId?: string;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the context menu for each participant  */
  onParticipantRemove?: (userId: string) => void;
};

const getDefaultRenderer = (
  myUserId?: string,
  onParticipantRemove?: (userId: string) => void,
  onRenderAvatar?: (remoteParticipant: CommunicationParticipant) => JSX.Element | null
): ((participant: CommunicationParticipant) => JSX.Element | null) => {
  return (participant: CommunicationParticipant) => {
    // Try to consider CommunicationParticipant as CallParticipant
    const callingParticipant = participant as CallParticipant;

    let presence: PersonaPresence | undefined = undefined;
    if (callingParticipant) {
      if (callingParticipant.state === 'Connected') {
        presence = PersonaPresence.online;
      } else if (callingParticipant.state === 'Idle') {
        presence = PersonaPresence.away;
      }
    }

    const menuItems: IContextualMenuItem[] = [];
    if (participant.userId !== myUserId && onParticipantRemove) {
      menuItems.push({
        key: 'Remove',
        text: 'Remove',
        onClick: () => onParticipantRemove(participant.userId)
      });
    }

    const onRenderIcon =
      callingParticipant?.isScreenSharing || callingParticipant?.isMuted
        ? () => (
            <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
              {callingParticipant.isScreenSharing && <CallControlPresentNewIcon size="small" />}
              {callingParticipant.isMuted && <MicOffIcon size="small" />}
            </Stack>
          )
        : () => <></>;

    const renderAvatar = onRenderAvatar
      ? () => {
          return onRenderAvatar(participant);
        }
      : undefined;

    if (participant.displayName) {
      return (
        <ParticipantItem
          displayName={participant.displayName}
          me={myUserId ? participant.userId === myUserId : false}
          menuItems={menuItems}
          presence={presence}
          onRenderIcon={onRenderIcon}
          onRenderAvatar={renderAvatar}
        />
      );
    }
    return null;
  };
};

/**
 * `ParticipantList` renders a list of participants in Calling or Chat. If property `onRenderParticipant` is not
 * assigned then each participant is rendered with `ParticipantItem`.
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const { participants, myUserId, onRenderParticipant, onParticipantRemove, onRenderAvatar } = props;

  const renderParticipant = onRenderParticipant ?? getDefaultRenderer(myUserId, onParticipantRemove, onRenderAvatar);

  return (
    <Stack className={participantListStyle}>
      {participants.map((participant: CommunicationParticipant) => {
        return renderParticipant(participant);
      })}
    </Stack>
  );
};
