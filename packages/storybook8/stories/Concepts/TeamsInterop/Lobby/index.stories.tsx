import { Meta } from '@storybook/react';
import { Lobby as LobbyComponent } from './Lobby.story';
import { controlsToAdd } from '../utils/controlsUtils';

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
