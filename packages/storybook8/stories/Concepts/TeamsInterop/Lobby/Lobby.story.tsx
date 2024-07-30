// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Lobby as LobbyComponent } from './snippets/Lobby.snippet';

const LobbyStory: (args) => JSX.Element = (args) => {
  return <LobbyComponent {...args} />;
};

export const Lobby = LobbyStory.bind({});
