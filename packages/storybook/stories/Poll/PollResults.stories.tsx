// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollResults as PollResultsComponent, PollResultsData } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollResultsStory = (args): JSX.Element => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          width: '90vw',
          height: '90vh'
        }
      }}
    >
      <PollResultsComponent {...args} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollResults = PollResultsStory.bind({});

const pollData: PollResultsData = [
  {
    option: 'Chips',
    chosen: true,
    votes: 2
  },
  {
    option: 'Cocoa Puffs',
    chosen: false,
    votes: 5
  },
  {
    option: 'Dunkaroos',
    chosen: false,
    votes: 2
  },
  {
    option: 'Roasted Almonds',
    chosen: false,
    votes: 1
  },
  {
    option: 'M&Ms',
    chosen: false,
    votes: 0
  }
];

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll-poll-results`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/PollResults`,
  component: PollResultsComponent,
  argTypes: {
    pollData: { control: 'object', defaultValue: pollData, name: 'Poll Data' }
  }
} as Meta;
