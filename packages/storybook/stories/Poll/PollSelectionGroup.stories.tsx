// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollSelectionGroup as PollSelectionGroupComponent, PollSelectionOptions } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollSelectionGroupStory = (args): JSX.Element => {
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
      <PollSelectionGroupComponent {...args} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollSelectionGroup = PollSelectionGroupStory.bind({});

const pollOptions: PollSelectionOptions = [
  {
    option: 'Chips',
    chosen: true
  },
  {
    option: 'Cocoa Puffs',
    chosen: false
  },
  {
    option: 'Dunkaroos',
    chosen: false
  },
  {
    option: 'Roasted Almonds',
    chosen: false
  },
  {
    option: 'M&Ms',
    chosen: false
  }
];

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll-poll-selection-group`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/Poll Selection Group`,
  component: PollSelectionGroupComponent,
  argTypes: {
    interactive: { control: 'boolean', defaultValue: true, name: 'Interactive' },
    pollOptions: { control: 'object', defaultValue: pollOptions, name: 'Poll Options' }
  }
} as Meta;
