// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type UserToken = {
  expiresIn: number;
  identity: string;
  token: string;
};

/**
 * This is implemented by contoso and passed to ChatProvider to use.
 */
export const getToken = async (): Promise<UserToken> => {
  try {
    const getTokenRequestOptions = {
      method: 'POST'
    };
    const getTokenResponse = await fetch('/token', getTokenRequestOptions);
    const cachedUserToken = (await getTokenResponse.json().then((_responseJson) => {
      return {
        expiresOn: _responseJson.expiresOn,
        identity: _responseJson.user.communicationUserId,
        token: _responseJson.token
      };
    })) as UserToken;
    return cachedUserToken;
  } catch (error) {
    console.error('Failed at getting token, Error: ', error);
  }
  throw new Error('user token undefined');
};
