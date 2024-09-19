// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

export const createThread = async (): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST'
    };
    const response = await fetch('createThread', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at creating thread ' + response.status);
    }
  } catch (error) {
    console.error('Failed creating thread, Error: ', error);
    throw new Error('Failed at creating thread');
  }
};
