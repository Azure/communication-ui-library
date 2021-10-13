// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IButtonStyles, IStackStyles, PrimaryButton, Stack } from '@fluentui/react';
import { PollOption, PollOptions, PollSelectionGroup } from './PollSelectionGroup';

/**
 * @private
 */
export interface PollSelectorProps {
  onOptionChosen?: (pollOption: PollOption) => void;
  pollOptions: PollOptions;
}

/**
 * @private
 */
export const PollSelector = (props: PollSelectorProps): JSX.Element => {
  const containerStyles: IStackStyles = {
    root: {
      height: '100%',
      width: '100%'
    }
  };
  const buttonStyles: IButtonStyles = {
    root: {
      height: '50px',
      borderRadius: '4px',
      width: '100%'
    }
  };
  return (
    <Stack verticalFill verticalAlign="center" styles={containerStyles} tokens={{ childrenGap: '8px' }}>
      <Stack.Item>
        <PollSelectionGroup pollOptions={props.pollOptions} interactive={true} />
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton text="Submit" styles={buttonStyles} />
      </Stack.Item>
    </Stack>
  );
};
