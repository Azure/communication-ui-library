// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { CONCEPTS_FOLDER_PREFIX } from '../constants';
import { controlsToAdd } from '../controlsUtils';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';
import { getLobbyDocs } from './TeamsInteropDocs';

const LobbyStory: (args) => JSX.Element = (args) => {
  return <LobbyComponent {...args} />;
};

export const Lobby = LobbyStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-teamsinterop-lobby`,
  title: `${CONCEPTS_FOLDER_PREFIX}/Teams Interop/Lobby`,
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
