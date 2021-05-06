// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const getThreadId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('threadId');

  return threadId;
};
