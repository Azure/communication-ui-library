// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import { boolean, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';

const LobbyComponentText = require('!!raw-loader!./snippets/Lobby.snippet.tsx').default;
const LobbyControlBarText = require('!!raw-loader!./snippets/LobbyControlBar.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
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

export const Lobby: () => JSX.Element = () => {
  const callStateText = text('Call State Text', 'Waiting for others to join');
  const isVideoReady = boolean('Show Video', false);

  return <LobbyComponent isVideoReady={isVideoReady} callStateText={callStateText} />;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop`,
  component: Lobby,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
