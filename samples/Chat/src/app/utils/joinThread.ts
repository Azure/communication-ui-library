// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatusCode } from './constants';

/**
 * This is a Contoso specific method. Specific to Sample App Heroes. Its meant to be called by Sample App Heroes
 * to add user to thread. Components will automatically know about the new participant when calling listParticipants.
 *
 * @param threadId the acs chat thread id
 * @param userId the acs communication user id
 * @param displayName the new participant's display name
 */
export const joinThread = async (threadId: string, userId: string, displayName: string): Promise<boolean> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Id: userId, DisplayName: displayName })
    };
    const response = await fetch(`/addUser/${threadId}`, requestOptions);
    if (response.status === StatusCode.CREATED) {
      return true;
    }
  } catch (error) {
    console.error('Failed at adding user, Error: ', error);
  }
  return false;
};
