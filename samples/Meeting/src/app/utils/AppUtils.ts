// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { v1 as generateGUID } from 'uuid';

export interface ACSMeetingLocator {
  threadId: string;
  groupLocator: GroupLocator;
}

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
export const getGroupIdFromUrl = (): ACSMeetingLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const gid = urlParams.get('groupId');
  const threadId = getThreadIdFromUrl();
  return gid && threadId ? { groupLocator: { groupId: gid }, threadId } : undefined;
};

/**
 * Get group id from the url's query params.
 */
export const getThreadIdFromUrl = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('threadId') || undefined;
};

export const createGroupId = async (): Promise<ACSMeetingLocator> => ({
  groupLocator: { groupId: generateGUID() },
  threadId: await createThread()
});

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

/**
 * This is a Contoso specific method. Specific to Sample App Heroes. Its meant to be called by Sample App Heroes
 * to add user to thread. Components will automatically know about the new participant when calling listParticipants.
 *
 * @param threadId the acs chat thread id
 * @param userId the acs communication user id
 * @param displayName the new participant's display name
 */
export const joinThread = async (threadId: string, userId: string, displayName: string): Promise<boolean> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Id: userId, DisplayName: displayName })
    };
    const response = await fetch(`/addUser/${threadId}`, requestOptions);
    if (response.status === StatusCode.CREATED) {
      return true;
    }
  } catch (error) {
    console.error('Failed at adding user, Error: ', error);
  }
  return false;
};

export const createThread = async (): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST'
    };
    const response = await fetch('/createThread', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at creating thread ' + response.status);
    }
  } catch (error) {
    console.error('Failed creating thread, Error: ', error);
    throw new Error('Failed at creating thread');
  }
};

export enum StatusCode {
  OK = 200,
  CREATED = 201
}

let endpointUrl: string | undefined;

export const getEndpointUrl = async (): Promise<string> => {
  if (endpointUrl === undefined) {
    try {
      const getRequestOptions = {
        method: 'GET'
      };
      const response = await fetch('/getEndpointUrl', getRequestOptions);
      const retrievedendpointUrl = await response.text().then((endpointUrl) => endpointUrl);
      endpointUrl = retrievedendpointUrl;
      return retrievedendpointUrl;
    } catch (error) {
      console.error('Failed at getting environment url, Error: ', error);
      throw new Error('Failed at getting environment url');
    }
  } else {
    return endpointUrl;
  }
};
