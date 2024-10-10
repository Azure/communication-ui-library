// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 */
export const createMockIterator = <T>(mockItems: T[]): any => {
  let i = 0;
  const end = mockItems.length;
  return {
    next() {
      if (i < end) {
        const iteration = Promise.resolve({ value: mockItems[i], done: false });
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
      const end = mockItems.length;
      // Hardcode page size this since its just for test purposes
      const pageSize = 2;
      return {
        next() {
          if (i < end) {
            const page: (T | undefined)[] = [];
            for (let j = 0; j < pageSize; j++) {
              if (i >= end) {
                break;
              }
              page.push(mockItems[i]);
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
