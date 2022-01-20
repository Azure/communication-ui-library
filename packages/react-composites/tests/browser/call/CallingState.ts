// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type CallingState = {
  remoteParticipants: TestRemoteParticipant[];
};

export type TestRemoteParticipant = {
  displayName: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isVideoStreamAvailable?: boolean;
};
