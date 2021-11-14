// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { v1 as generateGUID } from 'uuid';

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * Generate a random user name.
 * @return username in the format user####
 */
export const createRandomDisplayName = (): string => 'user' + Math.ceil(Math.random() * 1000);

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
