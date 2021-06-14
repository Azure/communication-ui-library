// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';

import { GUID_FOR_INITIAL_TOPIC_NAME } from './constants';

declare let __BUILDTIME__: string; // Injected by webpack
export const getBuildTime = (): string => __BUILDTIME__;

export function getChatSDKVersion(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../../../package.json')['dependencies']['@azure/communication-chat'];
}

export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const getImage = (avatar: string, isSmall: boolean): string => {
  let avatarType = '';
  switch (avatar) {
    case CAT:
      avatarType = 'cat';
      break;
    case MOUSE:
      avatarType = 'mouse';
      break;
    case KOALA:
      avatarType = 'koala';
      break;
    case OCTOPUS:
      avatarType = 'octopus';
      break;
    case MONKEY:
      avatarType = 'monkey';
      break;
    case FOX:
      avatarType = 'fox';
      break;
  }

  return `${isSmall ? '1' : '2'}x/${avatarType}.png`;
};

export const getBackgroundColor = (avatar: string): { backgroundColor: string } => {
  switch (avatar) {
    case CAT:
      return {
        backgroundColor: 'rgba(255, 250, 228, 1)'
      };
    case MOUSE:
      return {
        backgroundColor: 'rgba(33, 131, 196, 0.1)'
      };
    case KOALA:
      return {
        backgroundColor: 'rgba(197, 179, 173, 0.3)'
      };
    case OCTOPUS:
      return {
        backgroundColor: 'rgba(255, 240, 245, 1)'
      };
    case MONKEY:
      return {
        backgroundColor: 'rgba(255, 245, 222, 1)'
      };
    case FOX:
      return {
        backgroundColor: 'rgba(255, 231, 205, 1)'
      };
    default:
      return {
        backgroundColor: 'rgba(255, 250, 228, 1)'
      };
  }
};

export const existsTopicName = (topicName?: string): boolean =>
  !!topicName && topicName !== GUID_FOR_INITIAL_TOPIC_NAME;

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
