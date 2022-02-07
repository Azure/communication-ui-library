// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Calling state passed as as a query argument to set up MockCallingAdapter in playwright test
 */
export type TestCallingState = {
  remoteParticipants?: TestRemoteParticipant[];
  isScreenSharing?: boolean;
  page?: TestPageState;
};

/**
 * Remote participant state used in {@link TestCallingState}
 */
export type TestRemoteParticipant = {
  displayName: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isVideoStreamAvailable?: boolean;
  isScreenSharing?: boolean;
};

/**
 * Page state used in {@link TestCallingState}
 */
export type TestPageState =
  | 'accessDeniedTeamsMeeting'
  | 'call'
  | 'configuration'
  | 'joinCallFailedDueToNoNetwork'
  | 'leftCall'
  | 'lobby'
  | 'removedFromCall';
