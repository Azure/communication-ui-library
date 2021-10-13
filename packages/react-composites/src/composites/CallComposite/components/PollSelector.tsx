// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { IButtonStyles, IStackStyles, PrimaryButton, Stack } from '@fluentui/react';
import { PollSelectionGroup } from './PollSelectionGroup';
import { PollOption, PollOptions } from './PollTypes';

/**
 * @private
 */
export interface PollSelectorProps {
  onOptionSubmitted?: (pollOption: PollOption) => void;
  pollOptions: PollOptions;
}

/**
 * @private
 */
export const PollSelector = (props: PollSelectorProps): JSX.Element => {
  const [chosenOption, setChosenOption] = useState<PollOption | undefined>();

  const containerStyles: IStackStyles = {
    root: {
      height: '100%',
      width: '100%',
      maxWidth: '320px'
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
        <PollSelectionGroup
          onSelectionChanged={(option) => {
            setChosenOption(option);
          }}
          pollOptions={props.pollOptions}
          interactive={true}
        />
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton
          disabled={!chosenOption}
          text="Submit"
          styles={buttonStyles}
          onClick={() => {
            chosenOption && props.onOptionSubmitted && props.onOptionSubmitted(chosenOption);
          }}
        />
      </Stack.Item>
    </Stack>
  );
};
