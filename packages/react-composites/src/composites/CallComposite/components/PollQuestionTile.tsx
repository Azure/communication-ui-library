// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollOption, PollOptions } from './PollSelectionGroup';
import { PollSelector } from './PollSelector';
import { PollTile } from './PollTile';

/**
 * @private
 */
export interface QuestionPollTileProps {
  question: string;
  options: PollOptions;
  onSubmitAnswer: (answer: PollOption) => void;
}

/**
 * @private
 */
export const PollQuestionTile = (props: QuestionPollTileProps): JSX.Element => {
  return (
    <PollTile question={props.question}>
      <PollSelector pollOptions={props.options} onOptionSubmitted={props.onSubmitAnswer} />
    </PollTile>
  );
};
