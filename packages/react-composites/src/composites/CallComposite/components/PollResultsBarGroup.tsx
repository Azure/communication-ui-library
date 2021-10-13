// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollOption } from './PollSelectionGroup';
import { PollResultBar } from './PollResultBar';

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
  props.pollData.forEach((result) => (totalVotes += result.votes));

  return (
    <>
      {props.pollData.map((pollResult, index) => (
        <PollResultBar
          key={index}
          percentage={Math.floor((pollResult.votes / totalVotes) * 100)}
          votes={pollResult.votes}
        />
      ))}
    </>
  );
};
