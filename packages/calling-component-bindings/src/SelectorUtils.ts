// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';

/**
 * @private
 */
export const checkIsSpeaking = (participant: RemoteParticipantState): boolean =>
  participant.isSpeaking && !participant.isMuted;
