// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { encodeQueryData } from '../common/utils';
import { TestCallingState } from './TestCallingState';

/**
 * Create the test URL.
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param user - Test user the props of which populate query search parameters
 * @param state - Calling state of type TestCallingState passed as a query search parameter
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlWithMockAdapter = (
  serverUrl: string,
  testCallingState?: TestCallingState,
  qArgs?: { [key: string]: string }
): string => {
  const state: TestCallingState = testCallingState ?? {};
  return `${serverUrl}?${encodeQueryData({ mockCallState: JSON.stringify(state), ...qArgs })}`;
};
