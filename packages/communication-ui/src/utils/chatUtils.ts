// © Microsoft Corporation. All rights reserved.

export const compareMessages = (firstMessage: { createdOn?: Date }, secondMessage: { createdOn?: Date }): number => {
  if (firstMessage.createdOn === undefined) return 1;
  if (secondMessage.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.createdOn).getTime();
  const secondDate = new Date(secondMessage.createdOn).getTime();
  return firstDate - secondDate;
};
