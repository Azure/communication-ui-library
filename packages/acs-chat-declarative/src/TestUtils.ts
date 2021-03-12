// © Microsoft Corporation. All rights reserved.

import { ChatMessage } from '@azure/communication-chat';

export const createMockMessagesIterator = (mockMessages: ChatMessage[]): any => {
  let i = 0;
  const end = mockMessages.length;
  return {
    next() {
      if (i < end) {
        const iteration = Promise.resolve({ value: mockMessages[i], done: false });
        i++;
        return iteration;
      } else {
        return Promise.resolve({ done: true });
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage() {
      let i = 0;
      const end = mockMessages.length;
      // Hardcode page size this since its just for test purposes
      const pageSize = 2;
      return {
        next() {
          if (i < end) {
            const page: ChatMessage[] = [];
            for (let j = 0; j < pageSize; j++) {
              if (i >= end) {
                break;
              }
              page.push(mockMessages[i]);
              i++;
            }
            return Promise.resolve({ value: page, done: false });
          } else {
            return Promise.resolve({ done: true });
          }
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  };
};
