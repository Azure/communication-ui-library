// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type UserToken = {
  expiresOn: number;
  identity: string;
  token: string;
};

/**
 * This is implemented to get token from /sample/server
 */
export const getToken = async (): Promise<UserToken> => {
  const getTokenRequestOptions = {
    method: 'POST'
  };
  const getTokenResponse = await fetch('token', getTokenRequestOptions);
  const responseJson = await getTokenResponse.json();
  return {
    expiresOn: responseJson.expiresOn,
    identity: responseJson.user.communicationUserId,
    token: responseJson.token
  };
};
