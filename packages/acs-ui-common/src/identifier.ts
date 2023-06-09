// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier, createIdentifierFromRawId, getIdentifierRawId } from '@azure/communication-common';

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
  return createIdentifierFromRawId('4:' + id);
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
