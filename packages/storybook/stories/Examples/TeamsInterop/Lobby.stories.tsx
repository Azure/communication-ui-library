// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';
import { getDocs } from './TeamsInteropDocs';

const LobbyStory: (args) => JSX.Element = (args) => {
  return <LobbyComponent {...args} />;
};

export const Lobby = LobbyStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-lobby`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/Lobby`,
  component: Lobby,
  argTypes: {
    callStateText: { control: 'text', defaultValue: "You're in the lobby", name: 'Call State Text' },
    callStateSubText: { control: 'text', defaultValue: 'You should be admitted shortly', name: 'Call State Subtext' },
    isVideoReady: { control: 'boolean', defaultValue: false, name: 'Show Video' }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
