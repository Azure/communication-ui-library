// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollOptions } from './PollSelectionGroup';
import { PollSelector } from './PollSelector';
import { PollTile } from './PollTile';

/**
 * @private
 */
export interface QuestionPollTileProps {
  question: string;
  options: PollOptions;
}

/**
 * @private
 */
export const PollQuestionTile = (props: QuestionPollTileProps): JSX.Element => {
  return (
    <PollTile question={props.question}>
      <PollSelector pollOptions={props.options} />
    </PollTile>
  );
};
