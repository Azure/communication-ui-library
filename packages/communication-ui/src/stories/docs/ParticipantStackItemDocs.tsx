// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantStackItemComponent } from '../../components';

const importStatement = `import { ParticipantStackItem } from '@azure/communication-ui';`;

const ParticipantStackItemExample: () => JSX.Element = () => {
  return (
    <ParticipantStackItemComponent
      name="Johnny Bravo"
      state="Connected"
      isScreenSharing={false}
      isMuted={false}
      onMute={() => {}}
      onRemove={() => {}}
    />
  );
};

const exampleCode = `
<ParticipantStackItemComponent
  name='Johnny Bravo'
  state='Connected'
  isScreenSharing={false}
  isMuted={false}
  onMute={()=>{}} 
  onRemove={()=>{}}
/>
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ParticipantStackItem</Title>
      <Description>
        The ParticipantStackItem component displays a user's avatar, name, as well as presence, muted, and screenshare
        state.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ParticipantStackItemExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={ParticipantStackItemComponent} />
    </>
  );
};
