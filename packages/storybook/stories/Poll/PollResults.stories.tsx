// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollResults as PollResultsComponent, PollOptions } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollResultsStory = (args): JSX.Element => {
  const pollOptions: PollOptions = args.pollOptions;
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
      <PollResultsComponent pollData={{ prompt: '', options: pollOptions }} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollResults = PollResultsStory.bind({});

const pollOptions: PollOptions = [
  {
    option: 'Chips',
    votes: 2
  },
  {
    option: 'Cocoa Puffs',
    votes: 5
  },
  {
    option: 'Dunkaroos',
    votes: 2
  },
  {
    option: 'Roasted Almonds',
    votes: 1
  },
  {
    option: 'M&Ms',
    votes: 0
  }
];

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll-poll-results`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/PollResults`,
  component: PollResultsComponent,
  argTypes: {
    pollOptions: { control: 'object', defaultValue: pollOptions, name: 'Poll Options' }
  }
} as Meta;
