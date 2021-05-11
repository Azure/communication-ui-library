// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from 'react-components';

export const compareMessages = (firstMessage: ChatMessage, secondMessage: ChatMessage): number => {
  if (firstMessage.payload.createdOn === undefined) return 1;
  if (secondMessage.payload.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.payload.createdOn).getTime();
  const secondDate = new Date(secondMessage.payload.createdOn).getTime();
  return firstDate - secondDate;
};
