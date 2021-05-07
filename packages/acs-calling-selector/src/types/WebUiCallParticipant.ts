// © Microsoft Corporation. All rights reserved.

import { RemoteParticipantState } from '@azure/communication-calling';

export type WebUICallParticipant = {
  userId: string;
  displayName?: string;
  state: RemoteParticipantState;
  isScreenSharing: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
};
