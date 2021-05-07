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
import { WebUIParticipant } from '../types';

/**
 * Props for component `ParticipantList`
 */
export type ParticipantListProps = {
  /** Remote participants in user call */
  participants: WebUIParticipant[];
  /** User ID of user */
  myUserId?: string;
  /** Determines if screen sharing is on */
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element;
  /** Optional function to render each participant  */
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[];
};

const getDefaultRenderer = (
  myUserId?: string,
  onRenderParticipantMenu?: (remoteParticipant: WebUIParticipant) => IContextualMenuItem[]
): ((participant: WebUIParticipant) => JSX.Element) => {
  return (participant: WebUIParticipant) => {
    let presence: PersonaPresence | undefined = undefined;
    if (participant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (participant.state === 'Idle') {
      presence = PersonaPresence.away;
    }

    console.log('participant.userId: ' + participant.userId + ', myUserId:' + myUserId);

    return (
      <ParticipantItem
        name={participant.displayName ?? ''}
        isYou={myUserId ? participant.userId === myUserId : false}
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
  participants: WebUIParticipant[],
  myUserId?: string,
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element,
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[]
): JSX.Element[] => {
  const renderParticipant = onRenderParticipant ?? getDefaultRenderer(myUserId, onRenderParticipantMenu);
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
        items={[{ key: `${i}`, name: item.displayName, isYou: item.userId === myUserId, ...item }]}
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
  const allParticipants: WebUIParticipant[] = [];
  if (props.participants !== undefined) {
    props.participants.forEach((participant) => allParticipants.push(participant));
  }
  return (
    <Stack className={participantListStyle}>
      {renderParticipants(allParticipants, props.myUserId, props.onRenderParticipant, props.onRenderParticipantMenu)}
    </Stack>
  );
};
