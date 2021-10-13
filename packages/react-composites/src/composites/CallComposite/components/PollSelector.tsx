// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, Stack } from '@fluentui/react';
import { PollOption, PollOptions, PollSelectionGroup } from './PollSelectionGroup';

/**
 * @private
 */
export interface PollSelectorProps {
  onOptionChosen: (pollOption: PollOption) => void;
  pollData: PollOptions;
}

/**
 * @private
 */
export const PollSelector = (props: PollSelectorProps): JSX.Element => {
  return (
    <Stack verticalFill horizontalAlign="center">
      <PollSelectionGroup pollOptions={props.pollData} interactive={false} />
      <DefaultButton text="Submit" />
    </Stack>
  );
};
