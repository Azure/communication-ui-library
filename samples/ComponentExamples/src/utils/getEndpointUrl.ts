// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This function fetches the endpoint URL from the server.
 * @returns A promise that resolves to the endpoint URL as a string.
 */
export const fetchEndpointUrl = async (): Promise<string> => {
  const getRequestOptions = {
    method: 'GET'
  };
  const response = await fetch('getEndpointUrl', getRequestOptions);
  return await response.text();
};
