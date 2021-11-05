// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallParticipantListParticipant } from '@internal/react-components';
import { participantListSelector } from './participantListSelector';
import { CallClientState } from '@internal/calling-stateful-client';
import { CallingBaseSelectorProps } from '.';
import { createSelector } from 'reselect';

/**
 * Selector type for {@link ParticipantsButton} component.
 *
 * @public
 */
export type ParticipantsButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  participants: CallParticipantListParticipant[];
  myUserId: string;
};

/**
 * Selects data that drives {@link ParticipantsButton} component.
 *
 * @public
 */
export const participantsButtonSelector: ParticipantsButtonSelector = createSelector(
  [participantListSelector],
  (
    participantListProps
  ): {
    participants: CallParticipantListParticipant[];
    myUserId: string;
  } => {
    return participantListProps;
  }
);
