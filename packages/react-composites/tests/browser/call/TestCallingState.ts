// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Calling state passed as as a query argument to set up MockCallingAdapter in playwright test
 */
export type TestCallingState = {
  remoteParticipants?: TestRemoteParticipant[];
  isScreenSharing?: boolean;
  page?: TestPageState;
  latestErrors?: AdapterErrors;
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

/**
 * Map of errors to represent latest errors state used in {@link TestCallingState}
 */
export type AdapterErrors = {
  [target: string]: AdapterError;
};

/**
 * Error value used in {@link AdapterErrors}
 */
export interface AdapterError extends Error {
  /**
   * The operation that failed.
   */
  target: string;
  /**
   * Error thrown by the failed operation.
   */
  innerError: Error;
  /**
   * Timestamp added to the error in the adapter implementation.
   */
  timestamp: Date;
}
