// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @azure/communication-calling makes reference to the window object at import time so cannot be directly
// imported here because tests are run in a node environment (which does not have a window object.)
// Instead ensure we only import types.
import type { LatestMediaDiagnostics, LatestNetworkDiagnostics } from '@azure/communication-calling';

// Redeclare runtime values from the calling sdk package to above the issue mentioned above where the calling
// sdk package makes reference to the window object at import time.
export enum DiagnosticQuality {
  Good = 1,
  Poor = 2,
  Bad = 3
}

/**
 * Calling state passed as as a query argument to set up MockCallingAdapter in playwright test
 */
export type TestCallingState = {
  remoteParticipants?: TestRemoteParticipant[];
  isScreenSharing?: boolean;
  page?: TestPageState;
  diagnostics?: TestDiagnostics;
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
 * Diagnostics state used in {@link TestCallingState}
 */
export type TestDiagnostics = {
  /**
   * Stores diagnostics related to network conditions.
   */
  network?: LatestNetworkDiagnostics;
  /**
   * Stores diagnostics related to media quality.
   */
  media?: LatestMediaDiagnostics;
};

/**
 * Record of errors to represent latest errors state in {@link TestCallingState}
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
