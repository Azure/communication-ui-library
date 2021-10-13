// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollSelectionGroup as PollSelectionGroupComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollSelectionGroupStory = (args): JSX.Element => {
  return <PollSelectionGroupComponent {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollSelectionGroup = PollSelectionGroupStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll-selection-group`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/PollSelectionGroup`,
  component: PollSelectionGroupComponent,
  argTypes: {
    percentageWidth: { control: { type: 'range', min: 0, max: 100, step: 5 }, defaultValue: 20, name: 'Percentage' },
    percentage: { control: { type: 'number' }, defaultValue: 20, name: 'Percentage' },
    votes: { control: { type: 'number' }, defaultValue: 2, name: 'Votes' }
  }
} as Meta;
