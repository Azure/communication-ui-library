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
import { ParticipantItem } from 'react-components';
import { ListParticipant } from 'react-composites';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { participantStackStyle, overFlowButtonStyles, overflowSetStyle } from './styles/ParticipantStack.styles';
import { RemoteParticipant } from '@azure/acs-calling-declarative';

export type ParticipantListProps = {
  /** User ID of user */
  userId: string;
  /** Display name of user */
  displayName?: string;
  /** Remote participants in user call */
  remoteParticipants?: RemoteParticipant[];
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
    <ParticipantItem
      name={item.name}
      isYou={item.isYou}
      menuItems={item.isYou ? undefined : menuItems}
      presence={presence}
      onRenderIcon={() => (
        <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
          {item.isScreenSharing && <CallControlPresentNewIcon size="small" />}
          {item.isMuted && <MicOffIcon size="small" />}
        </Stack>
      )}
    />
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

export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const allParticipants: ListParticipant[] = props.remoteParticipants
    ? props.remoteParticipants.map((remoteParticipant) => {
        const videoStreams = Array.from(remoteParticipant.videoStreams);
        console.log(remoteParticipant.identifier + ' videoStreams: ' + JSON.stringify(videoStreams));
        const isScreenSharing = videoStreams.some(
          (videoStream) => videoStream[1].mediaStreamType === 'ScreenSharing' && videoStream[1].isAvailable
        );
        return {
          key: (remoteParticipant.identifier as unknown) as string,
          displayName: remoteParticipant.displayName,
          state: 'Connected', //TODO convert remoteParticipant.state to Persona.Presence,
          isScreenSharing: isScreenSharing,
          isMuted: remoteParticipant.isMuted,
          onRemove: () => {
            console.log('onRemove');
          },
          onMute: () => {
            console.log('onMute');
          }
        };
      })
    : [];
  allParticipants.push({
    key: props.userId,
    displayName: props.displayName ?? '',
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
