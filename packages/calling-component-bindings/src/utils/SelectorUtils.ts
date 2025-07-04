// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';

/**
 * @private
 */
export const checkIsSpeaking = (
  participant: RemoteParticipantState,
  inProgressRealTimeTextParticipantsIds?: string[]
): boolean =>
  inProgressRealTimeTextParticipantsIds
    ? (participant.isSpeaking && !participant.isMuted) ||
      inProgressRealTimeTextParticipantsIds.includes(toFlatCommunicationIdentifier(participant.identifier))
    : participant.isSpeaking && !participant.isMuted;
