// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantStackComponent } from '../../components';
import { ListParticipant } from '../../types';

const importStatement = `import { ParticipantStackComponent, ListParticipant } from '@azure/communication-ui';`;

const ParticipantStackExample: () => JSX.Element = () => {
  const remoteParticipants: ListParticipant[] = [
    {
      key: 'User2',
      displayName: 'User2',
      state: 'Connected',
      isMuted: false,
      isScreenSharing: false,
      onMute: () => {},
      onRemove: () => {}
    },
    {
      key: 'User3',
      displayName: 'User3',
      state: 'Connected',
      isMuted: false,
      isScreenSharing: false,
      onMute: () => {},
      onRemove: () => {}
    }
  ];

  return (
    <ParticipantStackComponent
      userId="User1"
      displayName="User1"
      remoteParticipants={remoteParticipants}
      isScreenSharingOn={false}
      isMuted={false}
    />
  );
};

const exampleCode = `
const remoteParticipants: ListParticipant[] = [
  {
    key: 'User2',
    displayName: 'User2',
    state: 'Connected',
    isMuted: false,
    isScreenSharing: false,
    onMute: () => {}, 
    onRemove: () => {}
  },
  {
    key: 'User3',
    displayName: 'User3',
    state: 'Connected',
    isMuted: false,
    isScreenSharing: false,
    onMute: () => {}, 
    onRemove: () => {}
  }
];

return (
  <ParticipantStackComponent
    userId='User1'
    displayName='User1'
    remoteParticipants={remoteParticipants}
    isScreenSharingOn={false}
    isMuted={false}
  />
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantStack</Title>
      <Description>
        The ParticipantStack component displays all participants in a call including the user in a stack. Each
        participant will display an avatar, name, and status.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ParticipantStackExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={ParticipantStackComponent} />
    </>
  );
};
