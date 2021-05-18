// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
} from '@azure/communication-common';

// A string newtype representing a CommunicationIdentifier.
//
// This string representation of CommunicationIdentifier is guaranteed to be stable for
// a unique Communication user. Thus,
// - it can be used to persist a user's identity in external databases.
// - it can be used as keys into a Map to store data for the user.
export type FlatCommunicationIdentifier = string;

export const toFlatCommunicationIdentifier = (id: CommunicationIdentifier): FlatCommunicationIdentifier => {
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
