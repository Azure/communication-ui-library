// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useMemo } from 'react';

/**
 * Shallow merge two objects and return a memoized result.
 *
 * @private
 */
export function useShallowMerge<T extends Record<string, unknown>>(
  target: T | undefined,
  source: T | undefined
): T | undefined {
  const memoizedMerge = useMemo(
    () =>
      ({
        ...(target || {}),
        ...(source || {})
      }) as T,
    [target, source]
  );

  if (!target && !source) {
    return undefined;
  }

  return memoizedMerge;
}
