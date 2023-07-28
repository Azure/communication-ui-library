// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * A Chat or Calling participant's state, as reflected in the UI.
 *
 * @public
 */
export type CommunicationParticipant = {
  /** User ID of participant */
  userId: string;
  /** Display name of participant */
  displayName?: string;
};
