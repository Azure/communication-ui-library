// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantList as ParticipantListComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, defaultLocalParticipant, defaultRemoteParticipants, hiddenControl } from '../../controlsUtils';
import { DefaultCallParticipantListExample } from './snippets/DefaultCall.snippet';
import { DefaultChatParticipantListExample } from './snippets/DefaultChat.snippet';
import { InteractiveCallParticipantListExample } from './snippets/InteractiveCall.snippet';
import { ParticipantListWithExcludedUserExample } from './snippets/WithExcludedUser.snippet';
export { ParticipantList } from './ParticipantList.story';

export const DefaultCallParticipantListDocsOnly = {
  render: DefaultCallParticipantListExample
};

export const DefaultChatParticipantListDocsOnly = {
  render: DefaultChatParticipantListExample
};

export const InteractiveCallParticipantListDocsOnly = {
  render: InteractiveCallParticipantListExample
};

export const ParticipantListWithExcludedUserDocsOnly = {
  render: ParticipantListWithExcludedUserExample
};

const meta: Meta = {
  title: 'Components/Participant List',
  component: ParticipantListComponent,
  argTypes: {
    excludeMe: controlsToAdd.excludeMeFromList,
    localParticipant: controlsToAdd.localParticipant,
    remoteParticipants: controlsToAdd.remoteParticipants,
    // Hiding auto-generated controls
    participants: hiddenControl,
    myUserId: hiddenControl,
    onRenderParticipant: hiddenControl,
    onRenderAvatar: hiddenControl,
    onParticipantRemove: hiddenControl,
    onRemoveParticipant: hiddenControl,
    onFetchParticipantMenuItems: hiddenControl,
    styles: hiddenControl
  },
  args: {
    excludeMe: false,
    localParticipant: defaultLocalParticipant,
    remoteParticipants: defaultRemoteParticipants
  }
} as Meta;

export default meta;
