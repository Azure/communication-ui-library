//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ListPageSettings } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

type IteratorCreatorFn<T, OptionsType, PageT = T[]> = (options?: OptionsType) => PagedAsyncIterableIterator<T, PageT>;

/**
 * Create a decorated iterator
 * returned iterators.
 *
 * @param iteratorCreator the function to create the original iterator
 * @param context chatContext
 * @param decorateFn the function for the decorating behavior
 */
export const createDecoratedIterator = <ItemType, OptionsType>(
  iteratorCreator: IteratorCreatorFn<ItemType, OptionsType>,
  context: ChatContext,
  decorateFn: (item: ItemType, context: ChatContext) => void
) => {
  return (...args: Parameters<IteratorCreatorFn<ItemType, OptionsType>>): PagedAsyncIterableIterator<ItemType> => {
    const threadsIterator = iteratorCreator(...args);
    return {
      async next() {
        const result = await threadsIterator.next();
        if (!result.done && result.value) {
          decorateFn(result.value, context);
        }
        return result;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings: ListPageSettings = {}): AsyncIterableIterator<ItemType[]> => {
        const pages = threadsIterator.byPage(settings);
        return {
          async next() {
            const result = await pages.next();
            const page = result.value;
            if (!result.done && result.value) {
              context.batch(() => {
                for (const item of page) {
                  decorateFn(item, context);
                }
              });
            }
            return result;
          },
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      }
    };
  };
};
