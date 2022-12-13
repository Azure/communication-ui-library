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
    return identifier.communicationUserId;
  }
  if (isMicrosoftTeamsUserIdentifier(identifier)) {
    if (identifier.isAnonymous) {
      return TEAMS_VISITOR_PREFIX + identifier.microsoftTeamsUserId;
    }
    if (identifier.cloud === 'dod') {
      return TEAMS_DOD_PREFIX + identifier.microsoftTeamsUserId;
    }
    if (identifier.cloud === 'gcch') {
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
    // The prefix is preserved for this variant of the identifier.
    return { communicationUserId: id };
  }
  if (id.startsWith(PHONE_NUMBER_PREFIX) || id.startsWith('+')) {
    const isPhoneNumber = id.startsWith(PHONE_NUMBER_PREFIX) ? id.replace(PHONE_NUMBER_PREFIX, '') : id;
    return { phoneNumber: isPhoneNumber };
  }
  if (id.startsWith(TEAMS_USER_PREFIX)) {
    return { microsoftTeamsUserId: id.replace(TEAMS_USER_PREFIX, '') };
  }
  if (id.startsWith(TEAMS_DOD_PREFIX)) {
    return { microsoftTeamsUserId: id.replace(TEAMS_DOD_PREFIX, ''), cloud: 'dod' };
  }
  if (id.startsWith(TEAMS_GCCH_PREFIX)) {
    return { microsoftTeamsUserId: id.replace(TEAMS_GCCH_PREFIX, ''), cloud: 'gcch' };
  }
  if (id.startsWith(TEAMS_VISITOR_PREFIX)) {
    return { microsoftTeamsUserId: id.replace(TEAMS_VISITOR_PREFIX, ''), isAnonymous: true };
  }
  return { id };
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
