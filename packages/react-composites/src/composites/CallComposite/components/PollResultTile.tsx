// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PollResults } from './PollResults';
import { PollTile } from './PollTile';
import { PollData } from './PollTypes';

/**
 * @private
 */
export interface PollResultTileProps {
  pollData: PollData;
}

/**
 * @private
 */
export const PollResultTile = (props: PollResultTileProps): JSX.Element => {
  return (
    <PollTile prompt={props.pollData.prompt}>
      <PollResults pollData={props.pollData} />
    </PollTile>
  );
};
