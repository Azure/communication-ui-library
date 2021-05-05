// © Microsoft Corporation. All rights reserved.

import {
  AzureCommunicationTokenCredential,
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  CommunicationTokenRefreshOptions,
  UnknownIdentifierKind
} from '@azure/communication-common';

import { AzureCommunicationUserCredential, RefreshOptions } from '@azure/communication-common-beta3';

import { AudioDeviceInfo, CallState, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity,
  CommunicationUiErrorFromError,
  CommunicationUiErrorInfo
} from '../types/CommunicationUiError';
import {
  TOO_MANY_REQUESTS_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  SERVICE_UNAVAILABLE_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  MULTI_STATUS,
  OK,
  NO_CONTENT,
  CREATED
} from '../constants/chatConstants';

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

/**
 * Check if a given string is a GUID.
 * Regex expression from: https://stackoverflow.com/a/13653180
 * @param str - string to check
 */
export const isGUID = (str: string): boolean =>
  !!str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

export const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided. If callback is provided then
// identity must also be provided for callback to be used.
// TODO: Delete this and use the one below once Chat has been upgraded to latest common
export const createAzureCommunicationUserCredentialBeta = (
  token: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): AzureCommunicationUserCredential => {
  if (refreshTokenCallback !== undefined) {
    const options: RefreshOptions = {
      initialToken: token,
      tokenRefresher: () => refreshTokenCallback(),
      refreshProactively: true
    };
    return new AzureCommunicationUserCredential(options);
  } else {
    return new AzureCommunicationUserCredential(token);
  }
};

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

// Helper function to get CommunicationUiError from ACS resource server response status code since we need to do this
// in many places. Returns a CommunicationUiError or undefined if the statusCode is success.
export const getErrorFromAcsResponseCode = (message: string, statusCode: number): CommunicationUiError | undefined => {
  let errorCode: CommunicationUiErrorCode = CommunicationUiErrorCode.UNKNOWN_STATUS_CODE_ERROR;
  let severity: CommunicationUiErrorSeverity = CommunicationUiErrorSeverity.WARNING;
  if (statusCode === OK || statusCode === NO_CONTENT || statusCode === MULTI_STATUS || statusCode === CREATED) {
    return undefined;
  } else if (statusCode === UNAUTHORIZED_STATUS_CODE) {
    severity = CommunicationUiErrorSeverity.ERROR;
    errorCode = CommunicationUiErrorCode.UNAUTHORIZED_ERROR;
  } else if (statusCode === FORBIDDEN_STATUS_CODE) {
    severity = CommunicationUiErrorSeverity.ERROR;
    errorCode = CommunicationUiErrorCode.FORBIDDEN_ERROR;
  } else if (statusCode === TOO_MANY_REQUESTS_STATUS_CODE) {
    errorCode = CommunicationUiErrorCode.TOO_MANY_REQUESTS_ERROR;
  } else if (statusCode === SERVICE_UNAVAILABLE_STATUS_CODE) {
    errorCode = CommunicationUiErrorCode.SERVICE_UNAVAILABLE_ERROR;
  } else if (statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE) {
    errorCode = CommunicationUiErrorCode.INTERNAL_SERVER_ERROR;
  }
  return new CommunicationUiError({ message: message + statusCode, code: errorCode, severity: severity });
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
