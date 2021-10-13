// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  PollOptions,
  PollQuestionTile,
  PollResultTile,
  PollTile as PollTileComponent
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

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

const PollTileStory = (args): JSX.Element => {
  let tileElement;
  if (args.tileType === 'blank') {
    tileElement = <PollTileComponent {...args} />;
  } else if (args.tileType === 'question') {
    tileElement = (
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <PollQuestionTile pollData={{ prompt: args.prompt, options: pollOptions }} onSubmitAnswer={() => {}} />
    );
  } else {
    tileElement = <PollResultTile pollData={{ prompt: args.prompt, options: pollOptions }} />;
  }

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
      {tileElement}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollTile = PollTileStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll-poll-Tile`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/PollTile`,
  component: PollTileComponent,
  argTypes: {
    prompt: { control: 'text', defaultValue: 'What snack should we add to the kitchen?', name: 'Poll Prompt' },
    tileType: {
      control: 'select',
      options: ['blank', 'question', 'results'],
      defaultValue: 'blank',
      name: 'Tile Type'
    }
  }
} as Meta;
