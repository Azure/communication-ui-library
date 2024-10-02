// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { Lobby as LobbyComponent, LobbyProps } from './snippets/Lobby.snippet';

const LobbyStory: (args: LobbyProps) => JSX.Element = (args) => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <LobbyComponent {...args} />
    </Stack>
  );
};

export const Lobby = LobbyStory.bind({});
