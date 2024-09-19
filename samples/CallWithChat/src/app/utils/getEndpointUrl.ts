// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const getEndpointUrl = async (): Promise<string> => {
  let endpointUrl: string | undefined = undefined;
  if (endpointUrl === undefined) {
    try {
      const getRequestOptions = {
        method: 'GET'
      };
      const response = await fetch('getEndpointUrl', getRequestOptions);
      const retrievedEndpointUrl = await response.text().then((endpointUrl) => endpointUrl);
      endpointUrl = retrievedEndpointUrl;
      return retrievedEndpointUrl;
    } catch (error) {
      console.error('Failed at getting environment url, Error: ', error);
      throw new Error('Failed at getting environment url');
    }
  } else {
    return endpointUrl;
  }
};
