import { boolean, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Lobby } from './Lobby.example';
import { getDocs } from './LobbyDocs';

export const LobbyComponent: () => JSX.Element = () => {
  const callStateText = text('Call State Text', 'Waiting for others to join');
  const isVideoReady = boolean('Show Video', false);

  return <Lobby isVideoReady={isVideoReady} callStateText={callStateText} />;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Lobby`,
  component: LobbyComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
