// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react';
import { controlsToAdd } from '../utils/controlsUtils';
import { Lobby as LobbyComponent } from './Lobby.story';

export const Lobby = {
  render: LobbyComponent
};

export default {
  title: 'Concepts/Teams Interop/Lobby',
  component: LobbyComponent,
  argTypes: {
    callStateText: controlsToAdd.callStateText,
    callStateSubText: controlsToAdd.callStateSubText,
    isVideoReady: controlsToAdd.isVideoReady
  },
  args: {
    callStateText: 'Connecting to the call',
    callStateSubText: 'Please wait while we connect you to the call',
    isVideoReady: false
  }
} as Meta;
