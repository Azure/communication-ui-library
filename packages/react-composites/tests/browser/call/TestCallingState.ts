// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Calling state passed to set up playwright test as a query argument
 */
export type TestCallingState = {
  remoteParticipants: TestRemoteParticipant[];
};

/**
 * Remote participant state used in {@link TestCallingState}
 */
export type TestRemoteParticipant = {
  displayName: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isVideoStreamAvailable?: boolean;
};
