// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollResultBar } from './PollResultBar';
import { Stack } from '@fluentui/react';
import { PollData } from './PollTypes';

/**
 * @private
 */
export interface PollResultsProps {
  pollData: PollData;
}

/**
 * @private
 */
export const PollResultBarGroup = (props: PollResultsProps): JSX.Element => {
  let totalVotes = 0;
  let maxVotesOnASingleResult = 0;
  props.pollData.options.forEach((pollOption) => {
    totalVotes += pollOption?.votes || 0;
    maxVotesOnASingleResult = Math.max(maxVotesOnASingleResult, pollOption.votes ?? 0);
  });

  return (
    <Stack tokens={{ childrenGap: '10px' }}>
      {props.pollData.options.map((pollResult, index) => (
        <Stack.Item key={index}>
          <PollResultBar
            percentage={Math.floor((pollResult.votes ?? 0 / totalVotes) * 100) ?? 0}
            barWidthPercentage={Math.floor((pollResult.votes ?? 0 / maxVotesOnASingleResult) * 100) ?? 0}
            votes={pollResult.votes ?? 0}
          />
        </Stack.Item>
      ))}
    </Stack>
  );
};
