// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { CallParticipant } from '@internal/react-components';
import { participantListSelector } from './participantListSelector';

export const participantsButtonSelector = reselect.createSelector(
  [participantListSelector],
  (
    participantListProps
  ): {
    participants: CallParticipant[];
    myUserId: string;
  } => {
    return participantListProps;
  }
);
