// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import {
  IContextualMenuItem,
  IOverflowSetItemProps,
  IconButton,
  OverflowSet,
  Stack,
  PersonaPresence
} from '@fluentui/react';
import { ParticipantItem } from './ParticipantItem';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { participantListStyle, overFlowButtonStyles, overflowSetStyle } from './styles/ParticipantList.styles';
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

const onRenderOverflowButton = (overflowItems: unknown): JSX.Element => (
  <IconButton
    role="menuitem"
    title="More options"
    styles={overFlowButtonStyles}
    menuIconProps={{ iconName: 'More' }}
    menuProps={{ items: overflowItems as IContextualMenuItem[] }}
  />
);

const renderParticipants = (
  participants: CommunicationParticipant[],
  myUserId?: string,
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null,
  onRenderAvatar?: (participant: CommunicationParticipant) => JSX.Element | null,
  onParticipantRemove?: (userId: string) => void
): (JSX.Element | null)[] => {
  const renderParticipant = onRenderParticipant ?? getDefaultRenderer(myUserId, onParticipantRemove, onRenderAvatar);
  const onRenderItem = (item: IOverflowSetItemProps): JSX.Element | null => {
    const participant = {
      userId: item.userId,
      displayName: item.displayName,
      state: item.state,
      isScreenSharing: item.isScreenSharing,
      isMuted: item.isMuted,
      isSpeaking: item.isSpeaking
    };
    return renderParticipant(participant);
  };
  return participants.map((item, i) => {
    return (
      <OverflowSet
        key={i}
        items={[{ key: `${i}`, displayName: item.displayName, me: item.userId === myUserId, ...item }]}
        role="menubar"
        vertical={false}
        onRenderOverflowButton={onRenderOverflowButton}
        onRenderItem={onRenderItem}
        styles={overflowSetStyle}
      />
    );
  });
};

/**
 * `ParticipantList` renders a list of participants in Calling or Chat. If property `onRenderParticipant` is not
 * assigned then each participant is rendered with `ParticipantItem`.
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const allParticipants: CommunicationParticipant[] = [];
  if (props.participants !== undefined) {
    props.participants.forEach((participant) => allParticipants.push(participant));
  }
  return (
    <Stack className={participantListStyle}>
      {renderParticipants(
        allParticipants,
        props.myUserId,
        props.onRenderParticipant,
        props.onRenderAvatar,
        props.onParticipantRemove
      )}
    </Stack>
  );
};
