// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';
import { MeetingEndReason } from './MeetingEndReason';

/**
 * Participants of a Meeting.
 * @alpha
 */
export interface MeetingParticipant
  // extends Pick<ChatParticipant, 'shareHistoryTime'>,
  extends Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  /** ID of the meeting participant. */
  id: CommunicationIdentifier;
  /** Describes the reason the meeting ended for this participant. */
  meetingEndReason?: MeetingEndReason;
}
