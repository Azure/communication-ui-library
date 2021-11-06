// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type UserToken = {
  expiresIn: number;
  identity: string;
  token: string;
};

// TODO: Need to revisit if cachedUserToken with respect to auto refresh token
let cachedUserToken: UserToken | undefined = undefined;

/**
 * This is implemented to get token from /sample/server
 */
export const getToken = async (): Promise<UserToken> => {
  if (!cachedUserToken) {
    try {
      const getTokenRequestOptions = {
        method: 'POST'
      };
      const getTokenResponse = await fetch('/token', getTokenRequestOptions);
      cachedUserToken = (await getTokenResponse.json().then((_responseJson) => {
        return {
          expiresOn: _responseJson.expiresOn,
          identity: _responseJson.user.communicationUserId,
          token: _responseJson.token
        };
      })) as UserToken;
    } catch (error) {
      console.error('Failed at getting token, Error: ', error);
    }
  }

  if (!cachedUserToken) {
    throw new Error('user token undefined');
  }

  return cachedUserToken;
};

export function clearCachedUserToken(): void {
  cachedUserToken = undefined;
}
