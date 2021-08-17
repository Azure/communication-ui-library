// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';

import { IContextualMenuItem, Stack, PersonaPresence, mergeStyles } from '@fluentui/react';
import { ParticipantItem } from './ParticipantItem';
import { MicOff20Filled, ShareScreenStart20Filled } from '@fluentui/react-icons';
import { participantListStyle } from './styles/ParticipantList.styles';
import { CommunicationParticipant, CallParticipant, OnRenderAvatarType } from '../types';
import { useIdentifiers } from '../identifiers';

/**
 * Props for component `ParticipantList`
 */
export type ParticipantListProps = {
  /** Participants in user call or chat */
  participants: CommunicationParticipant[];
  /** User ID of user */
  myUserId?: string;
  /**
   * If set to `true`, excludes the local participant from the participant list with use of `myUserId` props (required in this case).
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: OnRenderAvatarType;
  /** Optional callback to render the context menu for each participant  */
  onParticipantRemove?: (userId: string) => void;
};

const onRenderParticipantsDefault = (
  participants: CommunicationParticipant[],
  myUserId?: string,
  onParticipantRemove?: (userId: string) => void,
  onRenderAvatar?: OnRenderAvatarType
): (JSX.Element | null)[] => {
  return participants.map((participant: CommunicationParticipant) => {
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

    const iconStyles = mergeStyles({ height: '0.875rem' });
    const onRenderIcon =
      callingParticipant?.isScreenSharing || callingParticipant?.isMuted
        ? () => (
            <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
              {callingParticipant.isScreenSharing && (
                <ShareScreenStart20Filled className={iconStyles} primaryFill="currentColor" />
              )}
              {callingParticipant.isMuted && <MicOff20Filled className={iconStyles} primaryFill="currentColor" />}
            </Stack>
          )
        : () => <></>;

    if (participant.displayName) {
      return (
        <ParticipantItem
          key={participant.userId}
          userId={participant.userId}
          displayName={participant.displayName}
          me={myUserId ? participant.userId === myUserId : false}
          menuItems={menuItems}
          presence={presence}
          onRenderIcon={onRenderIcon}
          onRenderAvatar={onRenderAvatar}
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
  const ids = useIdentifiers();

  const allParticipants: CommunicationParticipant[] = useMemo(() => {
    if (participants === undefined) {
      return [];
    }

    if (!excludeMe || !myUserId) {
      return [...participants];
    }

    const userIndex = participants.map((p) => p.userId).indexOf(myUserId);

    if (userIndex === -1) {
      return [...participants];
    }

    const remoteParticipants = [...participants];
    remoteParticipants.splice(userIndex, 1);

    return remoteParticipants;
  }, [participants, excludeMe, myUserId]);

  return (
    <Stack data-ui-id={ids.participantList} className={participantListStyle}>
      {onRenderParticipant
        ? participants.map((participant: CommunicationParticipant) => onRenderParticipant(participant))
        : onRenderParticipantsDefault(allParticipants, myUserId, onParticipantRemove, onRenderAvatar)}
    </Stack>
  );
};
