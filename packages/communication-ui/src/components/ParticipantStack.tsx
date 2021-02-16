// © Microsoft Corporation. All rights reserved.

import * as React from 'react';

import { IContextualMenuItem, IOverflowSetItemProps, IconButton, OverflowSet, Stack } from '@fluentui/react';
import { overFlowButtonStyles, participantStackStyle, participantStackTokens } from './styles/ParticipantStack.styles';

import { connectFuncsToContext } from '../consumers/ConnectContext';
import { ListParticipant } from '../types/ListParticipant';
import { MapToParticipantListProps } from '../consumers/MapToParticipantListProps';
import { ParticipantStackItemComponent } from './ParticipantStackItem';

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

const defaultRenderer = (item: IOverflowSetItemProps): JSX.Element => (
  <ParticipantStackItemComponent
    name={item.name}
    state={item.state}
    isScreenSharing={item.isScreenSharing}
    isMuted={item.isMuted}
    onRemove={item.onRemove}
    onMute={item.onMute}
  />
);

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
      items={[{ name: item.displayName, ...item }]}
      role="menubar"
      vertical={false}
      onRenderOverflowButton={onRenderOverflowButton}
      onRenderItem={onRenderItem}
    />
  ));
};

export const ParticipantStackComponent = (props: ParticipantStackProps): JSX.Element => {
  const allParticipants: ListParticipant[] = Array.from(props.remoteParticipants);
  allParticipants.push({
    key: `${props.userId}`,
    displayName: `${props.displayName} (You)`,
    state: 'Connected',
    isScreenSharing: props.isScreenSharingOn,
    isMuted: props.isMuted
  });
  return (
    <Stack className={participantStackStyle} tokens={participantStackTokens}>
      {renderParticipants(allParticipants, props.onRenderParticipant)}
    </Stack>
  );
};

export default connectFuncsToContext(ParticipantStackComponent, MapToParticipantListProps);
