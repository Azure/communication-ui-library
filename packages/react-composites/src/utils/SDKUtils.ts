// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AzureCommunicationTokenCredential,
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  CommunicationTokenRefreshOptions,
  UnknownIdentifierKind
} from '@azure/communication-common';

import { AudioDeviceInfo, CallState, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorFromError,
  CommunicationUiErrorInfo
} from '../types/CommunicationUiError';

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

export const isInCall = (callState: CallState): boolean => !!(callState !== 'None' && callState !== 'Disconnected');

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

export const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided. If callback is provided then
// identity must also be provided for callback to be used.
export const createAzureCommunicationUserCredential = (
  token: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): AzureCommunicationTokenCredential => {
  if (refreshTokenCallback !== undefined) {
    const options: CommunicationTokenRefreshOptions = {
      token: token,
      tokenRefresher: () => refreshTokenCallback(),
      refreshProactively: true
    };
    return new AzureCommunicationTokenCredential(options);
  } else {
    return new AzureCommunicationTokenCredential(token);
  }
};

// This is a temporary solution to grab the userId from the token.
// In the future we want to use the AzureCommunicationUserCredential and CommunicationUser types into the Provider
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

export const propagateError = (error: Error, onErrorCallback?: (error: CommunicationUiErrorInfo) => void): void => {
  if (onErrorCallback) {
    onErrorCallback(CommunicationUiErrorFromError(error));
  } else {
    throw error;
  }
};

// Only support Desktop -- Chrome | Edge (Chromium) | Safari
export const isLocalScreenShareSupportedInBrowser = (): boolean => {
  return (
    !isMobileSession() &&
    (/chrome/i.test(navigator.userAgent.toLowerCase()) || /safari/i.test(navigator.userAgent.toLowerCase()))
  );
};

/**
 * Generates an identifier string for a given RemoteParticipant.identifier.
 *
 * @param identifier
 */
export function getRemoteParticipantKey(
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind
): string {
  let id = '';
  switch (identifier.kind) {
    case 'communicationUser': {
      id = identifier.communicationUserId;
      break;
    }
    case 'phoneNumber': {
      id = identifier.phoneNumber;
      break;
    }
    case 'microsoftTeamsUser': {
      id = identifier.microsoftTeamsUserId;
      break;
    }
    default: {
      id = identifier.id;
    }
  }
  return `${identifier.kind}_${id}`;
}
