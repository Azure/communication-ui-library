// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const compareMessages = (firstMessage: { createdOn?: Date }, secondMessage: { createdOn?: Date }): number => {
  if (firstMessage.createdOn === undefined) return 1;
  if (secondMessage.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.createdOn).getTime();
  const secondDate = new Date(secondMessage.createdOn).getTime();
  return firstDate - secondDate;
};

export const delay = (delay: number): Promise<void> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};
