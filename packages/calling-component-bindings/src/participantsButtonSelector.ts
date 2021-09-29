// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { CallParticipant } from '@internal/react-components';
import { participantListSelector } from './participantListSelector';

/**
 * Selects data that drives {@link ParticipantsButton} component.
 *
 * @public
 */
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
