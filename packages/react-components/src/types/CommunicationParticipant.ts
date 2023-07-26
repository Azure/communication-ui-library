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
  /* @conditional-compile-remove(rooms) */
  /** Role of participant in Rooms call */
  role?: Role;
};

/**
 * @public
 * The role of a call participant.
 */
export type Role = 'Presenter' | 'Attendee' | 'Consumer' | 'Organizer' | 'Co-organizer' | 'Unknown';
