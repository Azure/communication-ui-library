// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StartCallIdentifier } from '@azure/communication-react';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { v1 as generateGUID } from 'uuid';

/**
 * Function to see if we should be making a request for the adapter args from URL
 * @returns
 */
export const getStartSessionFromURL = (): boolean | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('newSession') === 'true';
};

/**
 * Properties needed to create a call screen for a  Azure Communication Services CallComposite.
 */
export type AdapterArgs = {
  token: string;
  userId: CommunicationUserIdentifier;
  targetCallees: StartCallIdentifier[];
  displayName?: string;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  throw new Error('Invalid token response');
};

/**
 * Get Teams Call Queue to make call with widget.
 *
 * @returns Id of call queue as a string
 */
export const fetchCallQueueId = async (): Promise<string> => {
  const getRequestOptions = {
    method: 'GET'
  };
  const response = await fetch('/getCallQueueId', getRequestOptions);
  if (response.ok) {
    const retrieveCallQueueId = await response.text().then((callQueueId) => callQueueId);
    if (retrieveCallQueueId) {
      return retrieveCallQueueId;
    }
  }
  throw new Error('Invalid callQueueId Response');
};

export const fetchAutoAttendantId = async (): Promise<string> => {
  const getRequestOptions = {
    method: 'GET'
  };
  const response = await fetch('/getAutoAttendantId', getRequestOptions);
  if (response.ok) {
    const retrieveCallQueueId = await response.text().then((callQueueId) => callQueueId);
    if (retrieveCallQueueId) {
      return retrieveCallQueueId;
    }
  }
  throw new Error('Invalid callQueueId Response');
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

export const isLandscape = (): boolean => window.innerWidth < window.innerHeight;

export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0];
};

export const WEB_APP_TITLE = document.title;
