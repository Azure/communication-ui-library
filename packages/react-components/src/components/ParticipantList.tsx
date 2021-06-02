// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';

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
  /**
   * Wether to exclude the user from the participant list or not
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the context menu for each participant  */
  onParticipantRemove?: (userId: string) => void;
};

const onRenderParticipantsDefault = (
  participants: CommunicationParticipant[],
  myUserId?: string,
  excludeMe?: boolean,
  onParticipantRemove?: (userId: string) => void,
  onRenderAvatar?: (remoteParticipant: CommunicationParticipant) => JSX.Element | null
): (JSX.Element | null)[] => {
  return participants.map((participant: CommunicationParticipant, index: number) => {
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
    if ((excludeMe || participant.userId !== myUserId) && onParticipantRemove) {
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
          key={index}
          displayName={participant.displayName}
          me={excludeMe || !myUserId ? false : participant.userId === myUserId}
          menuItems={menuItems}
          presence={presence}
          onRenderIcon={onRenderIcon}
          onRenderAvatar={renderAvatar}
        />
      );
    }
    return null;
  });
};

/**
 * `ParticipantList` renders a list of participants in Calling or Chat. If property `onRenderParticipant` is not
 * assigned then each participant is rendered with `ParticipantItem`.
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const { excludeMe = false, myUserId, participants, onParticipantRemove, onRenderAvatar, onRenderParticipant } = props;

  const allParticipants: CommunicationParticipant[] = useMemo(() => {
    if (participants !== undefined) {
      if (excludeMe && myUserId) {
        const userIndex = participants.map((p) => p.userId).indexOf(myUserId);

        if (userIndex !== -1) {
          const remoteParticipants = [...participants];
          remoteParticipants.splice(userIndex, 1);
          return remoteParticipants;
        }
      }

      return [...participants];
    }

    return [];
  }, [participants, excludeMe, myUserId]);

  return (
    <Stack className={participantListStyle}>
      {onRenderParticipant
        ? participants.map((participant: CommunicationParticipant) => onRenderParticipant(participant))
        : onRenderParticipantsDefault(allParticipants, myUserId, excludeMe, onParticipantRemove, onRenderAvatar)}
    </Stack>
  );
};
