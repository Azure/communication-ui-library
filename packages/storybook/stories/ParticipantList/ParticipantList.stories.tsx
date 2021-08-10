// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantList as ParticipantListComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Title, Heading, Description, Canvas, Props } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { DefaultCallParticipantListExample } from './snippets/DefaultCall.snippet';
import { DefaultChatParticipantListExample } from './snippets/DefaultChat.snippet';
import { InteractiveCallParticipantListExample } from './snippets/InteractiveCall.snippet';
import { ParticipantListWithExcludedUserExample } from './snippets/WithExcludedUser.snippet';

const DefaultCallParticipantListExampleText = require('!!raw-loader!./snippets/DefaultCall.snippet.tsx').default;
const DefaultChatParticipantListExampleText = require('!!raw-loader!./snippets/DefaultChat.snippet.tsx').default;
const InteractiveCallParticipantListExampleText =
  require('!!raw-loader!./snippets/InteractiveCall.snippet.tsx').default;
const ParticipantListWithExcludedUserExampleText =
  require('!!raw-loader!./snippets/WithExcludedUser.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Participant List</Title>
      <Description of={ParticipantListComponent} />

      <Heading>Default example for Chat</Heading>
      <Description>
        The ParticipantList for chat is by default a list of
        [PartipantItem](./?path=/docs/ui-components-participantitem--participant-item) components linked with state
        around each chat participant.
      </Description>
      <Canvas mdxSource={DefaultChatParticipantListExampleText}>
        <DefaultChatParticipantListExample />
      </Canvas>

      <Heading>Default example for Calling</Heading>
      <Description>
        ParticipantList for calling is by default a list of
        [PartipantItem](./?path=/docs/ui-components-participantitem--participant-item) components with presence linked
        to the participant call state, as well as icons for microphone and screen sharing states
      </Description>
      <Canvas mdxSource={DefaultCallParticipantListExampleText}>
        <DefaultCallParticipantListExample />
      </Canvas>

      <Heading>ParticipantList with local user excluded from the list</Heading>
      <Description>Local user can be excluded from the participant list like shown in the example below.</Description>
      <Canvas mdxSource={ParticipantListWithExcludedUserExampleText}>
        <ParticipantListWithExcludedUserExample />
      </Canvas>

      <Heading>Interactive Call example</Heading>
      <Description>
        ParticpantList is designed with a rendering override, `onRenderParticipant`, which allows you to have your own
        design or use the your own [PartipantItem](./?path=/docs/ui-components-participantitem--participant-item)
        components with their context menu style enabling interaction with this participant. For example, let us add
        menu items and icons to the participants using `menuItems` and `onRenderIcon` properties of
        [ParticipantItem](./?path=/docs/ui-components-participantitem--participant-item#props) like in the code below.
      </Description>
      <Description>
        For simplicity, we are using React `useState` to keep the state of every participant to decide which menu items
        and icons to show. You can now mute and unmute by clicking a participant in the rendered example below.
      </Description>
      <Description>
        Note: Each `ParticipantItem` needs a unique key to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={InteractiveCallParticipantListExampleText}>
        <InteractiveCallParticipantListExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={ParticipantListComponent} />
    </>
  );
};

const ParticipantListStory: (args) => JSX.Element = (args) => {
  const participantsControls = [...args.remoteParticipants, ...args.localParticipant];

  const mockParticipants = participantsControls.map((p, i) => {
    return {
      userId: `userId ${i}`,
      displayName: p.name,
      state: p.status,
      isMuted: p.isMuted,
      isScreenSharing: p.isScreenSharing
    };
  });

  const myUserId = mockParticipants[mockParticipants.length - 1].userId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onParticipantRemove = (_userId: string): void => {
    // Do something when remove a participant from list
  };

  return (
    <Stack>
      <ParticipantListComponent
        participants={mockParticipants}
        myUserId={myUserId}
        excludeMe={args.excludeMe}
        onParticipantRemove={onParticipantRemove}
      />
    </Stack>
  );
};

export const ParticipantList = ParticipantListStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-participantlist`,
  title: `${COMPONENT_FOLDER_PREFIX}/Participant List`,
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
    onParticipantRemove: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
