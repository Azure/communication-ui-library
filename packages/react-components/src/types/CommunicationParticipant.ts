// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FlatCommunicationIdentifier } from 'acs-ui-common';

/**
 * `CommunicationParticipant` represents a Chat or Calling participant's state
 */
export type CommunicationParticipant = {
  /** User ID of participant */
  userId: FlatCommunicationIdentifier;
  /** Display name of participant */
  displayName?: string;
};
