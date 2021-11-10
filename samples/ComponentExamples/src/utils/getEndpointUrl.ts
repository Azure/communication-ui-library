// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const fetchEndpointUrl = async (): Promise<string> => {
  const getRequestOptions = {
    method: 'GET'
  };
  const response = await fetch('/getEndpointUrl', getRequestOptions);
  return await response.text();
};
