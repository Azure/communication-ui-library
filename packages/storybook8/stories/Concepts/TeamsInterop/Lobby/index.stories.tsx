import { Meta } from '@storybook/react';
import { Lobby } from './Lobby.story';
import { controlsToAdd } from '../utils/controlsUtils';

export const LobbyDocsOnly = {
  render: Lobby
};

export default {
  title: 'Concepts/Teams Interop/Lobby',
  component: Lobby,
  argTypes: {
    callStateText: controlsToAdd.callStateText,
    callStateSubText: controlsToAdd.callStateSubText,
    isVideoReady: controlsToAdd.isVideoReady
  }
} as Meta;
