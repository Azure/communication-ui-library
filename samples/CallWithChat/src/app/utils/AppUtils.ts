// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GroupCallLocator, GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { v1 as generateGUID } from 'uuid';
import { getExistingThreadIdFromURL } from './getThreadId';
import { pushQSPUrl } from './pushQSPUrl';

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('/token');
  if (response.ok) {
    const responseAsJson = await response.json();
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw 'Invalid token response';
};

/**
 * Init React Render Tracker whenever it detects the query param 'rrt' is set to true.
 */
export const initReactRenderTracker = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const isEnabled = urlParams.get('rrt');
  if (isEnabled !== 'true') {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/react-render-tracker';
  document.head.appendChild(script);
};

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
  return teamsLink ? { meetingLink: decodeURIComponent(teamsLink) } : undefined;
};

export const ensureJoinableTeamsLinkPushedToUrl = (teamsLink: TeamsMeetingLinkLocator): void => {
  if (!getTeamsLinkFromUrl()) {
    pushQSPUrl({ name: 'teamsLink', value: encodeURIComponent(teamsLink.meetingLink) });
  }
};

/**
 * Get teams meeting id and passcode from the url's query params.
 */
export const getMeetingIdFromUrl = (): TeamsMeetingIdLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const meetingId = urlParams.get('meetingId');
  const passcode = urlParams.get('passcode');
  return meetingId
    ? { meetingId: decodeURIComponent(meetingId), passcode: passcode ? passcode : undefined }
    : undefined;
};

export const ensureJoinableMeetingIdPushedToUrl = (teamsLink: TeamsMeetingIdLocator): void => {
  if (!getTeamsLinkFromUrl()) {
    pushQSPUrl({ name: 'meetingId', value: encodeURIComponent(teamsLink.meetingId) });
    if (teamsLink.passcode) {
      pushQSPUrl({ name: 'passcode', value: teamsLink.passcode });
    }
  }
};

export const ensureJoinableCallLocatorPushedToUrl = (callLocator: GroupCallLocator): void => {
  if (!getGroupIdFromUrl()) {
    pushQSPUrl({ name: 'groupId', value: callLocator.groupId });
  }
};

export const ensureJoinableChatThreadPushedToUrl = (chatThreadId: string): void => {
  if (!getExistingThreadIdFromURL()) {
    pushQSPUrl({ name: 'threadId', value: chatThreadId });
  }
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

export const isSmallScreen = (): boolean => window.innerWidth < 700 || window.innerHeight < 400;

export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0];
};

declare let __BUILDTIME__: string; // Injected by webpack
export const buildTime = __BUILDTIME__;

declare let __CALLINGVERSION__: string; // Injected by webpack
export const callingSDKVersion = __CALLINGVERSION__;

declare let __CHATVERSION__: string; // Injected by webpack
export const chatSDKVersion = __CHATVERSION__;

declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
export const communicationReactSDKVersion = __COMMUNICATIONREACTVERSION__;

declare let __COMMITID__: string; //Injected by webpack
export const commitID = __COMMITID__;
