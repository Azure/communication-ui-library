// © Microsoft Corporation. All rights reserved.

import React from 'react';

import {
  IContextualMenuItem,
  IOverflowSetItemProps,
  IconButton,
  OverflowSet,
  Stack,
  PersonaPresence
} from '@fluentui/react';
import { connectFuncsToContext, ListParticipant, ParticipantItem } from '@azure/communication-ui';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { participantStackStyle, overFlowButtonStyles, overflowSetStyle } from './styles/ParticipantStack.styles';
import { MapToParticipantListProps } from './consumers/MapToParticipantListProps';

export type ParticipantStackProps = {
  /** User ID of user */
  userId: string;
  /** Display name of user */
  displayName: string;
  /** Remote participants in user call */
  remoteParticipants: ListParticipant[];
  /** Determines if screen sharing is on */
  isScreenSharingOn: boolean;
  /** Determines if user is muted */
  isMuted: boolean;
  /** Optional function to render each participant  */
  onRenderParticipant?: (participant: ListParticipant) => JSX.Element;
};

const defaultRenderer = (item: IOverflowSetItemProps): JSX.Element => {
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Mute',
      text: 'Mute',
      onClick: item.onMute
    },
    {
      key: 'Remove',
      text: 'Remove',
      onClick: item.onRemove
    }
  ];

  let presence = undefined;
  if (item.state === 'Connected') {
    presence = PersonaPresence.online;
  } else if (item.state === 'Idle') {
    presence = PersonaPresence.away;
  }

  return (
    <ParticipantItem name={item.name} isYou={item.isYou} menuItems={menuItems} presence={presence}>
      {item.isScreenSharing && <CallControlPresentNewIcon size="small" />}
      {item.isMuted && <MicOffIcon size="small" />}
    </ParticipantItem>
  );
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
  userId: string,
  participants: ListParticipant[],
  participantRenderer?: (participant: ListParticipant) => JSX.Element
): JSX.Element[] => {
  let onRenderItem = defaultRenderer;
  if (participantRenderer) {
    onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
      const participant = {
        key: item.key,
        displayName: item.displayName,
        state: item.state,
        isScreenSharing: item.isScreenSharing,
        isMuted: item.isMuted
      };
      return participantRenderer(participant);
    };
  }
  return participants.map((item, i) => (
    <OverflowSet
      key={i}
      items={[{ name: item.displayName, isYou: item.key === userId, ...item }]}
      role="menubar"
      vertical={false}
      onRenderOverflowButton={onRenderOverflowButton}
      onRenderItem={onRenderItem}
      styles={overflowSetStyle}
    />
  ));
};

export const ParticipantStackComponent = (props: ParticipantStackProps): JSX.Element => {
  const allParticipants: ListParticipant[] = Array.from(props.remoteParticipants);
  allParticipants.push({
    key: props.userId,
    displayName: props.displayName,
    state: 'Connected',
    isScreenSharing: props.isScreenSharingOn,
    isMuted: props.isMuted
  });
  return (
    <Stack className={participantStackStyle}>
      {renderParticipants(props.userId, allParticipants, props.onRenderParticipant)}
    </Stack>
  );
};

export const ParticipantStack = connectFuncsToContext(ParticipantStackComponent, MapToParticipantListProps);
