import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
const LobbyComponentText = require('!!raw-loader!./snippets/Lobby.snippet.tsx').default;
const LobbyControlBarText = require('!!raw-loader!./snippets/LobbyControlBar.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Lobby Component</Title>
      <Description>The Lobby component can be used for scenarios where the call is in a waiting state.</Description>
      <Heading>Create a Lobby ControlBar</Heading>
      <Source code={LobbyControlBarText} />
      <Heading>Create a Lobby Component</Heading>
      <Source code={LobbyComponentText} />
    </>
  );
};
