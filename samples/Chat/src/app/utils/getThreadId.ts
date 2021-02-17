// © Microsoft Corporation. All rights reserved.

export const getThreadId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('threadId');

  return threadId;
};
