// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createThread } from './createThread';
import { getExistingThreadIdFromURL } from './getThreadId';

const ERROR_TEXT_THREAD_NOT_RECORDED = 'Thread id is not recorded in server';
export const getThread = async (): Promise<string> => {
  const exisitedThreadId = await getExistingThreadIdFromURL();
  if (exisitedThreadId && exisitedThreadId.length > 0) {
    return exisitedThreadId;
  }

  const threadId = await createThread();
  if (!threadId) {
    console.error('Failed to create a thread, returned threadId is undefined or empty string');
    return '';
  } else {
    return threadId;
  }
};
