// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';
import { getLobbyDocs } from './TeamsInteropDocs';

const LobbyStory: (args) => JSX.Element = (args) => {
  return <LobbyComponent {...args} />;
};

export const Lobby = LobbyStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-lobby`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/Lobby`,
  component: Lobby,
  argTypes: {
    callStateText: controlsToAdd.callStateText,
    callStateSubText: controlsToAdd.callStateSubText,
    isVideoReady: controlsToAdd.isVideoReady
  },
  parameters: {
    docs: {
      page: () => getLobbyDocs()
    }
  }
} as Meta;
