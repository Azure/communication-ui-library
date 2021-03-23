// © Microsoft Corporation. All rights reserved.
import { ListPageSettings } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';

export interface PagedAsyncIterableIterator<T, PageT = T[], PageSettingsT = PageSettings> {
  next(): Promise<IteratorResult<T, T>>;
  [Symbol.asyncIterator](): PagedAsyncIterableIterator<T, PageT, PageSettingsT>;
  byPage: (settings?: PageSettingsT) => AsyncIterableIterator<PageT>;
}

export interface PageSettings {
  continuationToken?: string;
  maxPageSize?: number;
}

type IteratorCreatorFn<T, PageT = T[]> = (options?: any | undefined) => PagedAsyncIterableIterator<T, PageT>;

/**
 * Create a decorated iterator
 * returned iterators.
 *
 * @param iteratorCreator the function to create the original iterator
 * @param context chatContext
 * @param decorateFn the function for the decorating behavior
 */
export const createDecoratedIterator = <ItemType>(
  iteratorCreator: IteratorCreatorFn<ItemType>,
  context: ChatContext,
  decorateFn: (item: ItemType, context: ChatContext) => void
) => {
  return (...args: Parameters<IteratorCreatorFn<ItemType>>): PagedAsyncIterableIterator<ItemType> => {
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
