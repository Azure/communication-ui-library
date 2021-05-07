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
import { getACSId } from 'react-composites';
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
  onRenderParticipant?: (participant: RemoteParticipant) => JSX.Element;
  /** Optional function to render each participant  */
  onRenderParticipantMenu?: (remoteParticipant: RemoteParticipant) => IContextualMenuItem[];
};

const getDefaultRenderer = (
  userId: string,
  onRenderParticipantMenu?: (remoteParticipant: RemoteParticipant) => IContextualMenuItem[]
): ((participant: RemoteParticipant) => JSX.Element) => {
  return (participant: RemoteParticipant) => {
    let presence = undefined;
    if (participant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (participant.state === 'Idle') {
      presence = PersonaPresence.away;
    }

    const isScreenSharing = Array.from(participant.videoStreams.values()).some(
      (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
    );

    return (
      <ParticipantItem
        name={participant.displayName ?? ''}
        isYou={getACSId(participant.identifier) === userId}
        menuItems={onRenderParticipantMenu ? onRenderParticipantMenu(participant) : []}
        presence={presence}
        onRenderIcon={() => (
          <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
            {isScreenSharing && <CallControlPresentNewIcon size="small" />}
            {participant.isMuted && <MicOffIcon size="small" />}
          </Stack>
        )}
      />
    );
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
  userId: string,
  participants: RemoteParticipant[],
  onRenderParticipant?: (participant: RemoteParticipant) => JSX.Element,
  onRenderParticipantMenu?: (remoteParticipant: RemoteParticipant) => IContextualMenuItem[]
): JSX.Element[] => {
  const renderParticipant = onRenderParticipant ?? getDefaultRenderer(userId, onRenderParticipantMenu);
  const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
    const participant: RemoteParticipant = {
      ...item,
      state: item.state,
      identifier: item.identifier,
      videoStreams: item.videoStreams,
      isMuted: item.isMuted,
      isSpeaking: item.isSpeaking
    };
    return renderParticipant(participant);
  };
  return participants.map((item, i) => {
    const id = getACSId(item.identifier);
    return (
      <OverflowSet
        key={i}
        items={[{ key: id, name: item.displayName, isYou: id === userId, ...item }]}
        role="menubar"
        vertical={false}
        onRenderOverflowButton={onRenderOverflowButton}
        onRenderItem={onRenderItem}
        styles={overflowSetStyle}
      />
    );
  });
};

export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const allParticipants: RemoteParticipant[] = [];
  if (props.remoteParticipants !== undefined) {
    props.remoteParticipants.forEach((remoteParticipant) => allParticipants.push(remoteParticipant));
  }
  allParticipants.push({
    displayName: props.displayName ?? '',
    state: 'Connected',
    isMuted: props.isMuted,
    identifier: { kind: 'communicationUser', communicationUserId: props.userId },
    videoStreams: new Map(),
    isSpeaking: false
  });
  return (
    <Stack className={participantStackStyle}>
      {renderParticipants(props.userId, allParticipants, props.onRenderParticipant, props.onRenderParticipantMenu)}
    </Stack>
  );
};
