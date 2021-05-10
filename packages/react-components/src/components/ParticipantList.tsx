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
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: (participant: WebUIParticipant) => JSX.Element | null;
  /** Optional callback to render the context menu for each participant  */
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[];
};

const getDefaultRenderer = (
  myUserId?: string,
  onRenderParticipantMenu?: (remoteParticipant: WebUIParticipant) => IContextualMenuItem[],
  onRenderAvatar?: (remoteParticipant: WebUIParticipant) => JSX.Element | null
): ((participant: WebUIParticipant) => JSX.Element | null) => {
  return (participant: WebUIParticipant) => {
    let presence: PersonaPresence | undefined = undefined;
    if (participant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (participant.state === 'Idle') {
      presence = PersonaPresence.away;
    }

    if (participant.displayName) {
      return (
        <ParticipantItem
          name={participant.displayName}
          isYou={myUserId ? participant.userId === myUserId : false}
          menuItems={onRenderParticipantMenu ? onRenderParticipantMenu(participant) : []}
          presence={presence}
          onRenderIcon={() => (
            <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
              {participant.isScreenSharing && <CallControlPresentNewIcon size="small" />}
              {participant.isMuted && <MicOffIcon size="small" />}
            </Stack>
          )}
          onRenderAvatar={
            onRenderAvatar
              ? () => {
                  return onRenderAvatar(participant);
                }
              : undefined
          }
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
  participants: WebUIParticipant[],
  myUserId?: string,
  onRenderParticipant?: (participant: WebUIParticipant) => JSX.Element | null,
  onRenderAvatar?: (participant: WebUIParticipant) => JSX.Element | null,
  onRenderParticipantMenu?: (participant: WebUIParticipant) => IContextualMenuItem[]
): (JSX.Element | null)[] => {
  const renderParticipant =
    onRenderParticipant ?? getDefaultRenderer(myUserId, onRenderParticipantMenu, onRenderAvatar);
  const onRenderItem = (item: IOverflowSetItemProps): JSX.Element | null => {
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
      {renderParticipants(
        allParticipants,
        props.myUserId,
        props.onRenderParticipant,
        props.onRenderAvatar,
        props.onRenderParticipantMenu
      )}
    </Stack>
  );
};
