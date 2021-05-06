// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { clearCachedUserToken, getToken } from './getToken';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('getToken tests', () => {
  beforeEach(() => {
    // Ensure fetchMock is reset before tests to ensure fetch count is accurate
    fetchMock.resetMocks();

    // Ensure cached token value is reset before each test
    clearCachedUserToken();
  });

  test('getToken should make a fetch call and return the token response', async () => {
    // Arrange
    fetchMock.mockOnce(
      JSON.stringify({
        token: 'tokenValue',
        user: { id: 'idValue' },
        expiresOn: 1
      })
    );

    // Act
    const response = await getToken();

    // Assert
    expect(response.token).toEqual('tokenValue');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('getToken should use a cached value if the fetch has already been done and hence only call fetch once', async () => {
    // Arrange
    fetchMock.mockOnce(
      JSON.stringify({
        token: 'firstResponseValue',
        user: { id: 'idValue' },
        expiresOn: 1
      })
    );

    // Act
    const response1 = await getToken();
    fetchMock.mockOnce(
      JSON.stringify({
        token: 'secondResponseValue',
        user: { id: 'idValue' },
        expiresOn: 1
      })
    );
    const response2 = await getToken();

    // Assert
    expect(response1.token).toEqual('firstResponseValue');
    expect(response2.token).toEqual('firstResponseValue');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
