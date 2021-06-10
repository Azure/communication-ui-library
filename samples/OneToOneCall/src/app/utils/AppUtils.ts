// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
 * Generate a random user name.
 * @return username in the format user####
 */
const firstNames = ['Albus', 'Harry', 'Hermione', 'Lord', 'Ron', 'Dobby', 'Luna', 'Argus'],
  secondNames = ['Dumbledore', 'Potter', 'Granger', 'Voldemort', 'Elf', 'Lovegood', 'Filch'],
  randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min),
  randomName = (nameArray: string[]): string => `${nameArray[randomInt(0, nameArray.length - 1)]}`;
export const createRandomDisplayName = (): string => `${randomName(firstNames)} ${randomName(secondNames)}`;

/*
 * TODO:
 *  Remove this method once the SDK improves error handling for unsupported browser.
 */
export const isOnIphoneAndNotSafari = (): boolean => {
  const userAgent = navigator.userAgent;

  // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
  return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};

export const supportedBrowser = (): boolean => !isOnIphoneAndNotSafari();

declare let __BUILDTIME__: string; // Injected by webpack
export const getBuildTime = (): string => __BUILDTIME__;
