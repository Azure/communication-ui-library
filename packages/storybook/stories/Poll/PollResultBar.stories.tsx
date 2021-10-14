// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollResultBar as PollResultBarComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollResultBarStory = (args): JSX.Element => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          width: '50vw',
          height: '50vh'
        }
      }}
    >
      <PollResultBarComponent {...args} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollResultBar = PollResultBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll--poll-result-bar`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/Poll Result Bar`,
  component: PollResultBarComponent,
  argTypes: {
    barWidthPercentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      defaultValue: 80,
      name: 'Bar Width Percentage'
    },
    percentage: { control: 'number', defaultValue: 80, name: 'Percentage String' },
    votes: { control: 'number', defaultValue: 5, name: 'Votes' }
  }
} as Meta;
