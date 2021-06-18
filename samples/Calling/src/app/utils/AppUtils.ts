// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus, GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { LocalStorageKeys } from './constants';
import { v1 as generateGUID } from 'uuid';

/**
 * Get ACS user token from the Contoso server.
 */
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('/token');
  if (response.ok) {
    const responseAsJson = await response.json(); //(await response.json())?.value?.token;
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw 'Invalid token response';
};

/**
 * Quick helper function to map a call state to an isInCall boolean
 */
export const isInCall = (callStatus: CallStatus): boolean => !!(callStatus !== 'None' && callStatus !== 'Disconnected');

/**
 * Generate a random user name.
 * @return username in the format user####
 */
export const createRandomDisplayName = (): string => 'user' + Math.ceil(Math.random() * 1000);

/**
 * Get display name from local storage.
 */
export const getDisplayNameFromLocalStorage = (): string | null =>
  window.localStorage.getItem(LocalStorageKeys.DisplayName);

/**
 * Save display name into local storage.
 */
export const saveDisplayNameToLocalStorage = (displayName: string): void =>
  window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName);

/**
 * Get group id from the url's query params.
 */
export const getGroupIdFromUrl = (): GroupLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const gid = urlParams.get('groupId');
  return gid ? { groupId: gid } : undefined;
};

export const createGroupId = (): GroupLocator => ({ groupId: generateGUID() });

/**
 * Get teams meeting link from the url's query params.
 */
export const getTeamsLinkFromUrl = (): TeamsMeetingLinkLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamsLink = urlParams.get('teamsLink');
  return teamsLink ? { meetingLink: teamsLink } : undefined;
};

/*
 * TODO:
 *  Remove this method once the SDK improves error handling for unsupported browser.
 */
export const isOnIphoneAndNotSafari = (): boolean => {
  const userAgent = navigator.userAgent;

  // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
  return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};

export const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

export const isSmallScreen = (): boolean => window.innerWidth < 700 || window.innerHeight < 400;

export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0];
};

declare let __BUILDTIME__: string; // Injected by webpack
export const buildTime = __BUILDTIME__;

declare let __CALLINGVERSION__: string; // Injected by webpack
export const callingSDKVersion = __CALLINGVERSION__;
