// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

export const getUserId = (
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | undefined
): string => {
  let userId = '';
  switch (identifier?.kind) {
    case 'communicationUser': {
      userId = identifier.communicationUserId;
      break;
    }
    case 'microsoftTeamsUser': {
      userId = identifier.microsoftTeamsUserId;
      break;
    }
    case 'phoneNumber': {
      userId = identifier.phoneNumber;
      break;
    }
    case 'unknown': {
      userId = identifier.id;
      break;
    }
  }
  return userId;
};
