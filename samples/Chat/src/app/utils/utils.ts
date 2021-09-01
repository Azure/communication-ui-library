// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
