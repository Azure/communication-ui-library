// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

export const getACSId = (
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind
): string => {
  switch (identifier.kind) {
    case 'communicationUser': {
      return identifier.communicationUserId;
    }
    case 'phoneNumber': {
      return identifier.phoneNumber;
    }
    case 'microsoftTeamsUser': {
      return identifier.microsoftTeamsUserId;
    }
    default: {
      return identifier.id;
    }
  }
};
