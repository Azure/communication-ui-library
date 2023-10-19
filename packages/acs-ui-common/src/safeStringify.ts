// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Wrap JSON.stringify in a try-catch as JSON.stringify throws an exception if it fails.
 *
 * Use this only in areas where the JSON.stringify is non-critical and OK for the JSON.stringify to fail, such as logging.
 *
 * @internal
 */
export const _safeJSONStringify = (
  value: unknown,
  replacer: ((this: unknown, key: string, value: unknown) => unknown) | undefined = createSafeReplacer(),
  space?: string | number | undefined
): string | undefined => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

// Log all visited refs to avoid circular ref
const createSafeReplacer = (): (<T>(key: string, value: T) => T | string) => {
  const visited = new Set();
  return function replacer<T>(key: string, value: T): T | string {
    if (typeof value !== 'object') {
      return value;
    }

    if (visited.has(value)) {
      return 'Visited-Ref';
    } else {
      visited.add(value);
      return value;
    }
  };
};
