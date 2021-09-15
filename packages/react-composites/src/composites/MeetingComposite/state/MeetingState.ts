// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { MeetingParticipant } from './MeetingParticipants';
import { MeetingEndReason } from './MeetingEndReason';

/**
 * State of a single Meeting.
 * @alpha
 */
export interface MeetingState
  extends Pick<
      CallState,
      | 'callerInfo'
      | 'state'
      | 'isMuted'
      | 'isScreenSharingOn'
      | 'localVideoStreams'
      | 'transcription'
      | 'recording'
      | 'transfer'
      | 'screenShareRemoteParticipant'
      | 'startTime'
      | 'endTime'
    >,
    Pick<
      ChatThreadClientState,
      'chatMessages' | 'threadId' | 'properties' | 'readReceipts' | 'typingIndicators' | 'latestReadTime'
    > {
  /** Current Meeting ID. */
  id: string;
  /** Active participants in the current meeting. */
  participants: { [key: string]: MeetingParticipant };
  /** Participants who have left the current meeting. */
  participantsEnded: { [keys: string]: MeetingParticipant };
  /** Reason the current meeting has ended. */
  meetingEndReason?: MeetingEndReason;
}
