// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PollResultBar as PollResultBarComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';

import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const PollResultBarAnimatedStory = (args): JSX.Element => {
  const [votes, setVotes] = useState(0);
  useEffect(() => {
    const handle = setTimeout(() => {
      setVotes((votes + 13) % 100);
    }, 1000);
    return () => {
      clearTimeout(handle);
    };
  }, [votes, setVotes]);

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
      <PollResultBarComponent votes={votes} percentage={votes} barWidthPercentage={votes} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PollResultAnimatedBar = PollResultBarAnimatedStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-poll--poll-result-bar-animated`,
  title: `${COMPONENT_FOLDER_PREFIX}/Poll/Poll Result Bar Animated`,
  component: PollResultBarComponent
} as Meta;
