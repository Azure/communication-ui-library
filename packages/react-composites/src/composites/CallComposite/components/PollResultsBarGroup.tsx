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
  for (const pollOption of props.pollData.options) {
    totalVotes += pollOption?.votes || 0;
    maxVotesOnASingleResult = Math.max(maxVotesOnASingleResult, pollOption.votes ?? 0);
  }

  return (
    <Stack tokens={{ childrenGap: '10px' }}>
      {props.pollData.options.map((pollResult, index) => {
        const percentage = Math.floor(((pollResult.votes ?? 0) / totalVotes) * 100) ?? 0;
        const barPercentage = Math.floor(((pollResult.votes ?? 0) / maxVotesOnASingleResult) * 100) ?? 0;

        return (
          <Stack.Item key={index}>
            <PollResultBar percentage={percentage} barWidthPercentage={barPercentage} votes={pollResult.votes ?? 0} />
          </Stack.Item>
        );
      })}
    </Stack>
  );
};
