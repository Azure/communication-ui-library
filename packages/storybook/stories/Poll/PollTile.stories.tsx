// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollQuestionTile, PollResultTile, PollTile as PollTileComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const pollData = [
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

const PollTileStory = (args): JSX.Element => {
  let tileElement;
  if (args.tileType === 'blank') {
    tileElement = <PollTileComponent {...args} />;
  } else if (args.tileType === 'question') {
    tileElement = <PollQuestionTile options={pollData} question={args.question} />;
  } else {
    tileElement = <PollResultTile results={pollData} question={args.question} />;
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
    question: { control: 'text', defaultValue: 'What snack should we add to the kitchen?', name: 'Poll Question' },
    tileType: {
      control: 'select',
      options: ['blank', 'question', 'results'],
      defaultValue: 'blank',
      name: 'Tile Type'
    }
  }
} as Meta;
