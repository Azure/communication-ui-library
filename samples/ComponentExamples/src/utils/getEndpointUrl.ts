// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

let endpointUrl: string | undefined;

export const getEndpointUrl = async (): Promise<string> => {
  if (endpointUrl === undefined) {
    try {
      const getRequestOptions = {
        method: 'GET'
      };
      const response = await fetch('/getEndpointUrl', getRequestOptions);
      const retrievedendpointUrl = await response.text().then((endpointUrl) => endpointUrl);
      endpointUrl = retrievedendpointUrl;
      return retrievedendpointUrl;
    } catch (error) {
      console.error('Failed at getting environment url, Error: ', error);
      throw new Error('Failed at getting environment url');
    }
  } else {
    return endpointUrl;
  }
};
