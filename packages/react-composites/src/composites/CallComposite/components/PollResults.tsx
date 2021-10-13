// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack } from '@fluentui/react';
import { PollSelectionGroup } from './PollSelectionGroup';
import { PollResultBarGroup, PollResultsProps } from './PollResultsBarGroup';

/**
 * @private
 */
export const PollResults = (props: PollResultsProps): JSX.Element => {
  return (
    <Stack horizontal verticalFill horizontalAlign="stretch">
      <PollSelectionGroup pollOptions={props.pollData} interactive={false} />
      <PollResultBarGroup pollData={props.pollData} />
    </Stack>
  );
};
