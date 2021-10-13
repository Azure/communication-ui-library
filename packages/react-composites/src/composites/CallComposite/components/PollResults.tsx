// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStackStyles, Stack } from '@fluentui/react';
import { PollSelectionGroup } from './PollSelectionGroup';
import { PollResultBarGroup, PollResultsProps } from './PollResultsBarGroup';

/**
 * @private
 */
export const PollResults = (props: PollResultsProps): JSX.Element => {
  const containerStyles: IStackStyles = {
    root: {
      width: '100%'
    }
  };
  return (
    <Stack horizontal styles={containerStyles} verticalAlign="start" tokens={{ childrenGap: '30px' }}>
      <Stack.Item grow={1}>
        <PollSelectionGroup pollOptions={props.pollData} interactive={false} />
      </Stack.Item>
      <Stack.Item grow={1} styles={{ root: { marginTop: '5px' } }}>
        <PollResultBarGroup pollData={props.pollData} />
      </Stack.Item>
    </Stack>
  );
};
