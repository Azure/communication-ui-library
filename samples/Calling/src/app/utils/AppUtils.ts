// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { ParticipantRole, RoomCallLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { fromFlatCommunicationIdentifier, StartCallIdentifier } from '@azure/communication-react';
import { v1 as generateGUID } from 'uuid';

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('token?scope=voip');
  if (response.ok) {
    const responseAsJson = await response.json(); //(await response.json())?.value?.token;
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw new Error('Invalid token response');
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
/**
 * Create a new group id.
 * @return groupId in the format of a GUID
 */
export const createGroupId = (): GroupLocator => ({ groupId: generateGUID() });

/**
 * Create an ACS room
 */
export const createRoom = async (): Promise<string> => {
  const requestOptions = {
    method: 'POST'
  };
  const response = await fetch(`createRoom`, requestOptions);
  if (!response.ok) {
    throw 'Unable to create room';
  }

  const body = await response.json();
  return body['id'];
};

/**
 * Add user to an ACS room with a given roomId and role
 */
export const addUserToRoom = async (userId: string, roomId: string, role: ParticipantRole): Promise<void> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, roomId: roomId, role: role })
  };
  const response = await fetch('addUserToRoom', requestOptions);
  if (!response.ok) {
    throw 'Unable to add user to room';
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
 * Get teams meeting id and passcode from the url's query params.
 */
export const getMeetingIdFromUrl = (): TeamsMeetingIdLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const meetingId = urlParams.get('meetingId');
  const passcode = urlParams.get('passcode');
  return meetingId ? { meetingId: meetingId, passcode: passcode ? passcode : undefined } : undefined;
};

/**
 * Get teams meeting link from the url's query params.
 */
export const getIsCTE = (): boolean | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('isCTE') === 'true';
};

/**
 * Get room id from the url's query params.
 */
export const getRoomIdFromUrl = (): RoomCallLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  return roomId ? { roomId } : undefined;
};
/**
 * Get outbound participants.
 */
export const getOutboundParticipants = (outboundParticipants?: string[]): StartCallIdentifier[] | undefined => {
  if (outboundParticipants && outboundParticipants.length > 0) {
    const participants: StartCallIdentifier[] = outboundParticipants.map((participantId) => {
      return fromFlatCommunicationIdentifier(participantId);
    });
    // set call participants and do not update the window URL since there is not a joinable link
    return participants;
  }
  return undefined;
};

/**
 * Check if the device is an iPhone and not using Safari.
 * Remove this method once the SDK improves error handling for unsupported browser.
 * @returns true if the device is an iPhone and not using Safari, false otherwise.
 */
export const isOnIphoneAndNotSafari = (): boolean => {
  const userAgent = navigator.userAgent;
  // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
  return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};
/**
 * Check if the device is in landscape mode.
 * @returns true if the device is in landscape mode, false otherwise.
 */
export const isLandscape = (): boolean => window.innerWidth < window.innerHeight;
/**
 * Navigate to the home page by removing query parameters from the current URL.
 */
export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0] ?? window.location.href;
};
/**
 * Get the web app title from the document title.
 */
export const WEB_APP_TITLE = document.title;

declare let __BUILDTIME__: string; // Injected by webpack
/**
 * Build time of the application.
 */
export const buildTime = __BUILDTIME__;

declare let __CALLINGVERSION__: string; // Injected by webpack
/**
 * Version of the Calling SDK.
 */
export const callingSDKVersion = __CALLINGVERSION__;

declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
/**
 * Version of the Communication React SDK.
 */
export const communicationReactSDKVersion = __COMMUNICATIONREACTVERSION__;

declare let __COMMITID__: string; //Injected by webpack
/**
 * Commit ID of the application.
 */
export const commitID = __COMMITID__;
