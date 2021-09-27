// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
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
export const toFlatCommunicationIdentifier = (id: CommunicationIdentifier): string => {
  if (isCommunicationUserIdentifier(id)) {
    return id.communicationUserId;
  }
  if (isMicrosoftTeamsUserIdentifier(id)) {
    return id.microsoftTeamsUserId;
  }
  if (isPhoneNumberIdentifier(id)) {
    return id.phoneNumber;
  }
  return id.id;
};

/**
 * Reverse operation of {@link toFlatCommunicationIdentifier}.
 *
 * @public
 */
export const fromFlatCommunicationIdentifier = (id: string): CommunicationIdentifier => {
  // This implementation is currently a hack that only works with ACS identifiers.
  // TODO: Make `toFlatCommunicationIdentifier` not be lossy so this can reverse the process.
  return { communicationUserId: id };
};
