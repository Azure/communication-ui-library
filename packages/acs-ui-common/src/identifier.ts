// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
} from '@azure/communication-common';

const COMMUNICATION_USER_PREFIX = '8:acs:';
const PHONE_NUMBER_PREFIX = '4:';
const TEAMS_DOD_PREFIX = '8:dod:';
const TEAMS_GCCH_PREFIX = '8:gcch:';
const TEAMS_USER_PREFIX = '8:origid:';
const TEAMS_VISITOR_PREFIX = '8:teamsvisitor:';

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
  if (isCommunicationUserIdentifier(identifier)) {
    return COMMUNICATION_USER_PREFIX + identifier.communicationUserId;
  }
  if (isMicrosoftTeamsUserIdentifier(identifier)) {
    if (identifier.isAnonymous) {
      return TEAMS_VISITOR_PREFIX + identifier.microsoftTeamsUserId;
    }
    if (identifier.cloud == 'dod') {
      return TEAMS_DOD_PREFIX + identifier.microsoftTeamsUserId;
    }
    if (identifier.cloud == 'gcch') {
      return TEAMS_GCCH_PREFIX + identifier.microsoftTeamsUserId;
    }
    return TEAMS_USER_PREFIX + identifier.microsoftTeamsUserId;
  }
  if (isPhoneNumberIdentifier(identifier)) {
    return PHONE_NUMBER_PREFIX + identifier.phoneNumber;
  }
  return identifier.id;
};

/**
 * Reverse operation of {@link toFlatCommunicationIdentifier}.
 *
 * @public
 */
export const fromFlatCommunicationIdentifier = (id: string): CommunicationIdentifier => {
  if (id.startsWith(COMMUNICATION_USER_PREFIX)) {
    return { communicationUserId: id.substr(COMMUNICATION_USER_PREFIX.length) };
  }
  if (id.startsWith(PHONE_NUMBER_PREFIX)) {
    return { phoneNumber: id.substr(PHONE_NUMBER_PREFIX.length) };
  }
  if (id.startsWith(TEAMS_USER_PREFIX)) {
    return { microsoftTeamsUserId: id.substr(TEAMS_USER_PREFIX.length) };
  }
  if (id.startsWith(TEAMS_DOD_PREFIX)) {
    return { microsoftTeamsUserId: id.substr(TEAMS_DOD_PREFIX.length), cloud: 'dod' };
  }
  if (id.startsWith(TEAMS_GCCH_PREFIX)) {
    return { microsoftTeamsUserId: id.substr(TEAMS_GCCH_PREFIX.length), cloud: 'gcch' };
  }
  if (id.startsWith(TEAMS_VISITOR_PREFIX)) {
    return { microsoftTeamsUserId: id.substr(TEAMS_VISITOR_PREFIX.length), isAnonymous: true };
  }
  return { id };
};
