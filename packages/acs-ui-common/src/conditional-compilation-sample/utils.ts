// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/*
 * Some helpers needed for conditional compilation examples
 *
 * No conditional compilation examples in this file.
 */

/** @private */
export type DummyState = unknown;

/** @private */
export type DummyProps = unknown;

/** @private */
export function memoizedBoolean(state: DummyState, props: DummyProps): boolean {
  console.log(state, props);
  return true;
}

/** @private */
export function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean }
): (state: DummyState, props: DummyProps) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean };
/** @private */
export function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean }
): (state: DummyState, props: DummyProps) => { memoizedA: boolean; memoizedB: boolean };
/** @private */
export function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => unknown
) {
  return (state: DummyState, props: DummyProps): unknown => {
    return func(
      dependencySelectors[0](state, props),
      dependencySelectors[1](state, props),
      dependencySelectors[2](state, props)
    );
  };
}
