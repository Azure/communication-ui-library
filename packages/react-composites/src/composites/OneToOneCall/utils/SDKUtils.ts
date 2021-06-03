// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import { AudioDeviceInfo, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { CommunicationUiErrorCode, CommunicationUiError } from '../../../types/CommunicationUiError';

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

export function isSelectedDeviceInList<T extends AudioDeviceInfo | VideoDeviceInfo>(device: T, list: T[]): boolean {
  return !!list.find((item) => item.name === device.name);
}

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// Only support Desktop -- Chrome | Edge (Chromium) | Safari
export const isLocalScreenShareSupportedInBrowser = (): boolean => {
  return (
    !isMobileSession() &&
    (/chrome/i.test(navigator.userAgent.toLowerCase()) || /safari/i.test(navigator.userAgent.toLowerCase()))
  );
};

// FIXME: This is hack to grab the userId from the token.
//        Drop this in favor of explicitly passing in the userID to the composite.
export const getIdFromToken = (jwtToken: string): string => {
  const claimName = 'skypeid';

  const jwtTokenParts = jwtToken.split('.');
  if (jwtTokenParts.length !== 3) {
    throw new CommunicationUiError({
      message: 'Invalid jwt token',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }

  let base64DecodedClaims;
  let base64DecodedClaimsAsJson;
  try {
    base64DecodedClaims = atob(jwtTokenParts[1]);
    base64DecodedClaimsAsJson = JSON.parse(base64DecodedClaims);
  } catch (error) {
    throw new CommunicationUiError({
      message: 'Invalid access token',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR,
      error: error
    });
  }

  if (Object.prototype.hasOwnProperty.call(base64DecodedClaimsAsJson, claimName)) {
    return `8:${base64DecodedClaimsAsJson[claimName]}`;
  }

  throw new CommunicationUiError({
    message: 'Invalid access token',
    code: CommunicationUiErrorCode.CONFIGURATION_ERROR
  });
};
