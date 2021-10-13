// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollResults } from './PollResults';
import { PollResultsData } from './PollResultsBarGroup';
import { PollTile } from './PollTile';

/**
 * @private
 */
export interface QuestionPollTileProps {
  question: string;
  results: PollResultsData;
}

/**
 * @private
 */
export const PollResultTile = (props: QuestionPollTileProps): JSX.Element => {
  return (
    <PollTile question={props.question}>
      <PollResults pollData={props.results} />
    </PollTile>
  );
};
