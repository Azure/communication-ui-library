// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * `CommunicationParticipant` represents a Chat or Calling participant's state
 */
export interface CommunicationParticipant {
  /** User ID of participant */
  userId: string;
  /** Display name of participant */
  displayName?: string;
}
