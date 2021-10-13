// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollCreator as PollCreatorComponent, PollQuestion } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollCreatorStory = (args): JSX.Element => {
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
      <PollCreatorComponent
        onPresentPoll={(question: PollQuestion) => {
          console.log('Egad! A new question is come: ', question);
        }}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollCreator = PollCreatorStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll--poll-creator`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/PollCreator`,
  component: PollCreatorComponent
} as Meta;
