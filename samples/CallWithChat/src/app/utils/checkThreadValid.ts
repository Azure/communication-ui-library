// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatusCode } from './constants';

export const checkThreadValid = async (threadId: string | null): Promise<boolean> => {
  try {
    if (threadId === null) {
      console.log('Fail to validate thread id because thread id is null');
      return false;
    }
    const validationRequestOptions = { method: 'GET' };
    const validationResponse = await fetch('/isValidThread/' + threadId, validationRequestOptions);
    return validationResponse.status === StatusCode.OK;
  } catch (error) {
    console.error('Failed at getting isThreadIdValid, Error: ', error);
    return false;
  }
};
