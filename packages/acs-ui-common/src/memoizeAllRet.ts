// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _safeJSONStringify } from './safeStringify';

/**
 * The function memoize is to cache all results return by the same function args
 * It will compare function args to determine whether to return previous value or return a new one
 * @param  fnToMemoize - the function needs to be memorized
 * @public
 */
export const memoizeAllRet = <ArgsT extends unknown[], FnRetT>(
  fnToMemoize: (...args: ArgsT) => FnRetT
): ((...args: ArgsT) => FnRetT) => {
  const cache = new Map<string, FnRetT>();

  return (...args: ArgsT): FnRetT => {
    const key = _safeJSONStringify(args);
    if (!key) {
      throw new Error('Get undefined key from args, please check args');
    }
    const value = cache.get(key);
    if (value) {
      return value;
    }
    const ret = fnToMemoize(...args);
    cache.set(key, ret);
    return ret;
  };
};
