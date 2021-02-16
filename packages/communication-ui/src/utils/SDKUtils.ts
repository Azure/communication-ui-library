// © Microsoft Corporation. All rights reserved.

import { AzureCommunicationUserCredential, RefreshOptions } from '@azure/communication-common';

import { AudioDeviceInfo, CallState, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import {
  CallingApplication,
  CommunicationUser,
  PhoneNumber,
  UnknownIdentifier,
  isCallingApplication,
  isCommunicationUser,
  isPhoneNumber
} from '@azure/communication-common';

export const getACSId = (
  identifier: CommunicationUser | CallingApplication | UnknownIdentifier | PhoneNumber
): string => {
  if (isCommunicationUser(identifier)) {
    return identifier.communicationUserId;
  } else if (isCallingApplication(identifier)) {
    return identifier.callingApplicationId;
  } else if (isPhoneNumber(identifier)) {
    return identifier.phoneNumber;
  } else {
    return identifier.id;
  }
};

export function isSelectedDeviceInList<T extends AudioDeviceInfo | VideoDeviceInfo>(device: T, list: T[]): boolean {
  return !!list.find((item) => item.name === device.name);
}

export const isInCall = (callState: CallState): boolean => !!(callState !== 'None' && callState !== 'Disconnected');

/**
 * Check if a given string is a GUID.
 * Regex expression from: https://stackoverflow.com/a/13653180
 * @param s string to check
 */
export const isGUID = (s: string): boolean =>
  !!s.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.getSource().id === newStream.getSource().id;
};

export const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided. If callback is provided then
// identity must also be provided for callback to be used.
export const createAzureCommunicationUserCredential = (
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

// This is a temporary solution to grab the userId from the token.
// In the future we want to use the AzureCommunicationUserCredential and CommunicationUser types into the Provider
export const getIdFromToken = (jwtToken: string): string => {
  const claimName = 'skypeid';

  const jwtTokenParts = jwtToken.split('.');
  if (jwtTokenParts.length !== 3) {
    throw new Error('invalid jwt token');
  }

  const base64DecodedClaims = atob(jwtTokenParts[1]);
  const base64DecodedClaimsAsJson = JSON.parse(base64DecodedClaims);

  if (Object.prototype.hasOwnProperty.call(base64DecodedClaimsAsJson, claimName)) {
    return `8:${base64DecodedClaimsAsJson[claimName]}`;
  }

  throw new Error('invalid access token');
};
