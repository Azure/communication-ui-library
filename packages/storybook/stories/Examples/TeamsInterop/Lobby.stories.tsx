// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { boolean, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';
import { getDocs } from './TeamsInteropDocs';

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
