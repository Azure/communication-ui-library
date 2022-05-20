// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallParticipantListParticipant } from '@internal/react-components';
import { ParticipantListSelector, participantListSelector } from './participantListSelector';
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

function selectParticipantsButton(
  participantListProps: ReturnType<ParticipantListSelector>
): ReturnType<ParticipantsButtonSelector> {
  return participantListProps;
}

/**
 * Selects data that drives {@link ParticipantsButton} component.
 *
 * @public
 */
export const participantsButtonSelector: ParticipantsButtonSelector = createSelector(
  [participantListSelector],
  selectParticipantsButton
);
