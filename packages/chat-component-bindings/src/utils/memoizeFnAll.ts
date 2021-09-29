// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export type FunctionWithKey<KeyT, ArgsT extends any[], RetT> = (key: KeyT, ...args: ArgsT) => RetT;

/**
 * @private
 */
export type CallbackType<KeyT, ArgsT extends any[], FnRetT> = (
  memoizedFn: FunctionWithKey<KeyT, ArgsT, FnRetT>
) => FnRetT[];

const argsCmp = (args1: any[], args2: any[], objCmp: (obj1: any, obj2: any) => boolean): boolean => {
  return args1.length === args2.length && args1.every((arg1, index) => objCmp(args2[index], arg1));
};

/**
 * The function memoize a series of function calls in a single pass,
 * it memoizes all the args and return in a single run of the callback function, and read it in the next round of execution
 * note: this is a memory opimized function which will only memoize one round of bulk calls
 * @param  fnToMemoize - the function needs to be bulk memorized, key paramter need to be provided as cache id
 * @param  shouldCacheUpdate - the validate function for comparing 2 argument, return true when 2 args are equal
 * @returns callback function includes a series calls of memoizedFn, and each call will get cache result if args are the same(according to shouldCacheUpdate fn)
 * @example
 * ```ts
 * const items = [{id:1, value:3}];
 * const heavyFn = (_key, value) => { // key is not used in the function, but it is a cache id
 *   // assume this is a heavy caculation
 *   return value+1;
 * }
 *
 * const memoizeHeavyFnAll = memoizeFnAll(heavyFn);
 * const generateValueArray = (memoizedHeavyFn) => (
 *   items.map(item => {
 *     memoizedHeavyFn(item.id, item.value);
 *   })
 * );
 *
 * const result = memoizeHeavyFnAll(generateValueArray); // Cache: {}, nextCache: {1: 4 *new}, heavyFn call times: 1
 *
 * // Argument changed
 * items[0].value = 2
 * const result0 = memoizeHeavyFnAll(generateValueArray); // Cache: {1: 4}, nextCache: {1: 3 *new}, heavyFn call times: 1
 *
 * // Cache added
 * items.push({id:3, value:4});
 * const result1 = memoizeHeavyFnAll(generateValueArray); // Cache: {1: 3 *hit}, nextCache: {1: 3, 3: 5 *new}, heavyFn call times: 1
 *
 * // Cache removed
 * delete items[0];
 * const result2 = memoizeHeavyFnAll(generateValueArray); // Cache: {1: 3, 3: 5 *hit}, nextCache: {3: 5}, heavyFn call times: 0
 * ```
 */
export const memoizeFnAll = <KeyT, ArgsT extends any[], FnRetT, CallBackT extends CallbackType<KeyT, ArgsT, FnRetT>>(
  fnToMemoize: FunctionWithKey<KeyT, ArgsT, FnRetT>,
  shouldCacheUpdate: (args1: any, args2: any) => boolean = Object.is
): ((callback: CallBackT) => FnRetT[]) => {
  let cache = new Map<KeyT, [ArgsT, FnRetT]>();
  let nextCache = new Map<KeyT, [ArgsT, FnRetT]>();

  return (callback: CallbackType<KeyT, ArgsT, FnRetT>): FnRetT[] => {
    const memoizedFn: FunctionWithKey<KeyT, ArgsT, FnRetT> = (key: KeyT, ...args: ArgsT): FnRetT => {
      const value = cache.get(key);
      if (value) {
        const [preArgs, ret] = value;
        if (argsCmp(preArgs, args, shouldCacheUpdate)) {
          nextCache.set(key, [args, ret]);
          return ret;
        }
      }
      const ret = fnToMemoize(key, ...args);
      nextCache.set(key, [args, ret]);
      return ret;
    };
    const retValue = callback(memoizedFn);
    cache = nextCache;
    nextCache = new Map<KeyT, [ArgsT, FnRetT]>();
    return retValue;
  };
};
