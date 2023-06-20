// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationIdentifier,
  createIdentifierFromRawId,
  getIdentifierRawId,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  isUnknownIdentifier
} from '@azure/communication-common';

/**
 * A string representation of a {@link @azure/communication-common#CommunicationIdentifier}.
 *
 * This string representation of CommunicationIdentifier is guaranteed to be stable for
 * a unique Communication user. Thus,
 * - it can be used to persist a user's identity in external databases.
 * - it can be used as keys into a Map to store data for the user.
 *
 * @public
 */
export const toFlatCommunicationIdentifier = (identifier: CommunicationIdentifier): string => {
  return getIdentifierRawId(identifier);
};

/**
 * Reverse operation of {@link toFlatCommunicationIdentifier}.
 *
 * @public
 */
export const fromFlatCommunicationIdentifier = (id: string): CommunicationIdentifier => {
  // if the id passed is a phone number we need to build the rawId to pass in
  const rawId = id.indexOf('+') === 0 ? '4:' + id : id;
  return createIdentifierFromRawId(rawId);
};

/**
 * Returns a CommunicationIdentifier.
 * @internal
 */
export const _toCommunicationIdentifier = (id: string | CommunicationIdentifier): CommunicationIdentifier => {
  if (typeof id === 'string') {
    return fromFlatCommunicationIdentifier(id);
  }
  return id;
};

/**
 * Check if an object is identifier.
 *
 * @internal
 */
export const _isValidIdentifier = (identifier: CommunicationIdentifier): boolean => {
  return (
    isCommunicationUserIdentifier(identifier) ||
    isPhoneNumberIdentifier(identifier) ||
    isMicrosoftTeamsUserIdentifier(identifier) ||
    isUnknownIdentifier(identifier)
  );
};
