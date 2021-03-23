// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ParticipantItem } from '../../components';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';

const importStatement = `
import { ParticipantItem } from '@azure/communication-ui';
import { IContextualMenuItem, PersonaPresence } from '@fluentui/react';`;

const ParticipantItemExample: () => JSX.Element = () => {
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Mute',
      text: 'Mute',
      onClick: () => alert('Mute')
    },
    {
      key: 'Remove',
      text: 'Remove',
      onClick: () => alert('Remove')
    }
  ];

  return <ParticipantItem name="Johnny Bravo" menuItems={menuItems} presence={PersonaPresence.online} />;
};

const exampleCode = `
const menuItems: IContextualMenuItem[] = [
  {
    key: 'Mute',
    text: 'Mute',
    onClick: () => alert('Mute')
  },
  {
    key: 'Remove',
    text: 'Remove',
    onClick: () => alert('Remove')
  }
];

return (
  <ParticipantItem
    name="Johnny Bravo"
    menuItems={menuItems}
    presence={PersonaPresence.online}
  />
);
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
        <ParticipantItemExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={ParticipantItem} />
    </>
  );
};
