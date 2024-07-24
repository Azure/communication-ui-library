// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import React from 'react';

import { controlsToAdd } from '../utils/controlsUtils';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';

const LobbyStory: (args) => JSX.Element = (args) => {
  return <LobbyComponent {...args} />;
};

export const Lobby = LobbyStory.bind({});

export default {
  title: 'Concepts/Teams Interop/Lobby',
  component: Lobby,
  argTypes: {
    callStateText: controlsToAdd.callStateText,
    callStateSubText: controlsToAdd.callStateSubText,
    isVideoReady: controlsToAdd.isVideoReady
  }
} as Meta;
