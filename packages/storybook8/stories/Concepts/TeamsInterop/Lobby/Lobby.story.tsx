// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Lobby as LobbyComponent, LobbyProps } from './snippets/Lobby.snippet';
import { compositeExperienceContainerStyle } from '../../constants';
import { Stack } from '@fluentui/react';

const LobbyStory: (args: LobbyProps) => JSX.Element = (args) => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <LobbyComponent {...args} />
    </Stack>
  );
};

export const Lobby = LobbyStory.bind({});
