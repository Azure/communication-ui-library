// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollOption } from './PollSelectionGroup';
import { PollResultBar } from './PollResultBar';
import { Stack } from '@fluentui/react';

/**
 * @private
 */
export interface PollResultData extends PollOption {
  votes: number;
}

/**
 * @private
 */
export type PollResultsData = PollResultData[];

/**
 * @private
 */
export interface PollResultsProps {
  pollData: PollResultsData;
}

/**
 * @private
 */
export const PollResultBarGroup = (props: PollResultsProps): JSX.Element => {
  let totalVotes = 0;
  let maxVotesOnASingleResult = 0;
  props.pollData.forEach((result) => {
    totalVotes += result.votes;
    maxVotesOnASingleResult = Math.max(maxVotesOnASingleResult, result.votes);
  });

  return (
    <Stack tokens={{ childrenGap: '10px' }}>
      {props.pollData.map((pollResult, index) => (
        <Stack.Item key={index}>
          <PollResultBar
            percentage={Math.floor((pollResult.votes / totalVotes) * 100)}
            barWidthPercentage={Math.floor((pollResult.votes / maxVotesOnASingleResult) * 100)}
            votes={pollResult.votes}
          />
        </Stack.Item>
      ))}
    </Stack>
  );
};
