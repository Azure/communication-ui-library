// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollSelector } from './PollSelector';
import { PollTile } from './PollTile';
import { PollData, PollOption } from './PollTypes';

/**
 * @private
 */
export interface QuestionPollTileProps {
  pollData: PollData;
  onSubmitAnswer: (answer: PollOption) => void;
}

/**
 * @private
 */
export const PollQuestionTile = (props: QuestionPollTileProps): JSX.Element => {
  return (
    <PollTile prompt={props.pollData.prompt}>
      <PollSelector pollOptions={props.pollData.options} onOptionSubmitted={props.onSubmitAnswer} />
    </PollTile>
  );
};
