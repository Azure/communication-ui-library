// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Message } from '@internal/react-components';

export const compareMessages = (
  firstMessage: Message<'chat' | 'system' | 'custom'>,
  secondMessage: Message<'chat' | 'system' | 'custom'>
): number => {
  if (firstMessage.payload.createdOn === undefined) return 1;
  if (secondMessage.payload.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.payload.createdOn).getTime();
  const secondDate = new Date(secondMessage.payload.createdOn).getTime();
  return firstDate - secondDate;
};
