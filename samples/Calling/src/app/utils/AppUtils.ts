// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupLocator, RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { Role } from '@internal/react-components';
import { v1 as generateGUID } from 'uuid';

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('/token?scope=voip');
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

export const createRoomId = async (): Promise<string> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Host: 'alkwa-fn-test.azurewebsites.net',
      'Content-Type': 'application/json',
      'Referrer-Policy': 'no-referrer'
    }
  };
  const response = await fetch('http://localhost:7071/api/Rooms-CreateRoom', requestOptions);
  if (!response.ok) {
    throw 'Invalid token response';
  }

  const body = await response.json();
  return body['id'];
};

/**
 * Joins an ACS room with a given roomId and role
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const joinRoom = async (userId: string, roomId: string, role: Role): Promise<void> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ acsUserId: userId, roomId: roomId, role: role })
  };
  const response = await fetch('http://localhost:7071/api/Rooms-AddParticipants', requestOptions);
  if (!response.ok) {
    throw 'Invalid token response';
  }
};

/**
 * Get teams meeting link from the url's query params.
 */
export const getTeamsLinkFromUrl = (): TeamsMeetingLinkLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamsLink = urlParams.get('teamsLink');
  return teamsLink ? { meetingLink: teamsLink } : undefined;
};

/**
 * Get room id from the url's query params.
 */
export const getRoomIdFromUrl = (): RoomLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  return roomId ? { roomId } : undefined;
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

export const isLandscape = (): boolean => window.innerWidth < window.innerHeight;

export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0];
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

const isGroupLink = (link: string): boolean => link.indexOf('-') !== -1;

export const createLocator = (link: string): TeamsMeetingLinkLocator | GroupLocator | RoomLocator => {
  if (isTeamsMeetingLink(link)) {
    return { meetingLink: link };
  } else if (isGroupLink(link)) {
    return { groupId: link };
  } else {
    return { roomId: link };
  }
};

export const WEB_APP_TITLE = document.title;

declare let __BUILDTIME__: string; // Injected by webpack
export const buildTime = __BUILDTIME__;

declare let __CALLINGVERSION__: string; // Injected by webpack
export const callingSDKVersion = __CALLINGVERSION__;

declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
export const communicationReactSDKVersion = __COMMUNICATIONREACTVERSION__;
