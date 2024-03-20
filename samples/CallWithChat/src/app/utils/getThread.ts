// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createThread } from './createThread';
import { getExistingThreadIdFromURL } from './getThreadId';

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
