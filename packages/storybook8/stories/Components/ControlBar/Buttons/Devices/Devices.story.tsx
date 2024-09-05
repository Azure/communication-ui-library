// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { DevicesButtonWithKnobs } from './snippets/DevicesButtonWithKnobs.snippet';

const DevicesStory = (args: any): JSX.Element => {
  return <DevicesButtonWithKnobs {...args} />;
};

export const Devices = DevicesStory.bind({});
