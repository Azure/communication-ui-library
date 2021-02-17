// © Microsoft Corporation. All rights reserved.

import { CallState } from '@azure/communication-calling';
import preval from 'preval.macro';
import { LocalStorageKeys } from './constants';

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
  throw new Error('Invalid token response');
};

/**
 * Quick helper function to map a call state to an isInCall boolean
 */
export const isInCall = (callState: CallState): boolean => !!(callState !== 'None' && callState !== 'Disconnected');

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
 * @return groupId string or null
 */
export const getGroupIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('groupId');
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

export const getBuildTime = (): string => {
  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
  return dateTimeStamp;
};
