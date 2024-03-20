// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const postRefreshTokenParameters = {
  method: 'POST'
};

export const refreshToken = async (userIdentity: string): Promise<string> => {
  const response = await fetch(`/refreshToken/${userIdentity}`, postRefreshTokenParameters);
  if (response.ok) {
    return (await response.json()).token;
  } else {
    throw new Error('could not refresh token');
  }
};
