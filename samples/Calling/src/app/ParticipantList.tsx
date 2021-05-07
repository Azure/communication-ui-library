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
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { participantStackStyle, overFlowButtonStyles, overflowSetStyle } from './styles/ParticipantStack.styles';
import { WebUIParticipant } from '@azure/acs-calling-selector';

export type ParticipantListProps = {
  /** User ID of user */
  userId: string;
  /** Display name of user */
  displayName?: string;
  /** Remote participants in user call */
  remoteParticipants?: WebUIParticipant[];
  /** Determines if screen sharing is on */
  isScreenSharingOn?: boolean;
  /** Determines if user is muted */
  isMuted?: boolean;
  /** Optional function to render each participant  */
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element;
  /** Optional function to render each participant  */
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[];
};

const getDefaultRenderer = (
  userId: string,
  onRenderParticipantMenu?: (remoteParticipant: WebUIParticipant) => IContextualMenuItem[]
): ((participant: WebUIParticipant) => JSX.Element) => {
  return (participant: WebUIParticipant) => {
    let presence = undefined;
    if (participant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (participant.state === 'Idle') {
      presence = PersonaPresence.away;
    }

    return (
      <ParticipantItem
        name={participant.displayName ?? ''}
        isYou={participant.userId === userId}
        menuItems={onRenderParticipantMenu ? onRenderParticipantMenu(participant) : []}
        presence={presence}
        onRenderIcon={() => (
          <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
            {participant.isScreenSharing && <CallControlPresentNewIcon size="small" />}
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
  participants: WebUIParticipant[],
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element,
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[]
): JSX.Element[] => {
  const renderParticipant = onRenderParticipant ?? getDefaultRenderer(userId, onRenderParticipantMenu);
  const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
    const participant: WebUIParticipant = {
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
        items={[{ key: `${i}`, name: item.displayName, isYou: item.userId === userId, ...item }]}
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
  const allParticipants: WebUIParticipant[] = [];
  if (props.remoteParticipants !== undefined) {
    props.remoteParticipants.forEach((remoteParticipant) => allParticipants.push(remoteParticipant));
  }
  allParticipants.push({
    userId: props.userId,
    displayName: props.displayName ?? '',
    state: 'Connected',
    isMuted: props.isMuted,
    isScreenSharing: props.isScreenSharingOn,
    isSpeaking: false
  });
  return (
    <Stack className={participantStackStyle}>
      {renderParticipants(props.userId, allParticipants, props.onRenderParticipant, props.onRenderParticipantMenu)}
    </Stack>
  );
};
