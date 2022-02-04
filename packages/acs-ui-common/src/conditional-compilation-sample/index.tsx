// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * This folder contains some easy to understand conditional compilation directive samples.
 *
 * They are intended to be a cheet-sheat when you're trying to figure out how to make conditional compilation work for you.
 *
 * Just like the rest of the code in this repository, this module can be built for both flavored builds:
 *
 * To build for beta (i.e. without any code removed by conditional compilation):
 *
 * ```bash
 *   rush switch-flavor:beta  # This is also the default
 *   rush build -t .
 * ``
 *
 * To build for stable (i.e. marked code conditionally removed):
 *
 * ```bash
 *   rush switch-flavor:stable
 *   rush build -t .
 * ```
 *
 * In the latter case, you can see the transformed code in `packages/acs-ui-common/preprocessed/conditional-compilation-sample/`.
 */

/**
 * Conditionally define a type or interface.
 */
/* @conditional-compile-remove-from(stable) */
type A = number;

/* @conditional-compile-remove-from(stable) */
interface B {
  c: number;
}

/**
 * Conditionally export from a module.
 */
/* @conditional-compile-remove-from(stable) */
export interface C {
  a: A;
  b: B;
}

/**
 * Add a parameter to an existing function
 *
 * FIXME: This doesn't yet work. `f` is not removed from the function signature, although it is removed from the function call in the body.
 */
export function d(e: number, /* @conditional-compile-remove-from(stable) */ f: number) {
  console.log(e);
  /* @conditional-compile-remove-from(stable) */
  console.log(f);
  // Similarly, call the function with conditional parameters:
  // FIXME: Doesn't yet work, because `f` was not removed from the function signature.
  // d(e, /* @conditional-compile-remove-from(stable) */ f);
}

/** ****************************************************************** */

/**
 * Add conditional statements for logical differences between build flavors.
 *
 * Usually, it is cleaner to extract out a helper function that houses the conditional logic. Some common examples.
 */

/**
 * Conditional inclusion of JSX components can be a bit tricky, because we must remove partial expressions.
 */
export function GottaHaveAnExtraStackItem(props: {}): JSX.Element {
  return (
    <ul>
      <li>Old kid</li>
      {/* @conditional-compile-remove-from(stable) */ <li>New Kid</li>}
    </ul>
  );
}
/**
 * Conditionally modify props passed to JSX components.
 *
 * It's best to recast this as a conditional variable assignment.
 */
export function OverrideSomePropInBeta(props: {}): JSX.Element {
  const flavorDependentProp = propTrampoline();
  return <h1 className={flavorDependentProp}>Nothing to see here!</h1>;
}
function propTrampoline() {
  let propValue = 'general';
  /* @conditional-compile-remove-from(stable) */
  propValue = 'II class';
  return propValue;
}

/** ****************************************************************** */

/**
 * A common example where a combination of some of the examples above is required is extending a selector.
 *
 * Note how the selector has a conditional field in the *return type* and the *implementation*, but does not have a conditional
 * dependency (and hence no conditional argument). This follows from the principle that conditional compilation should be restricted
 * to be as close to the API boundary as possible -- we require the selector's type to not include the new field in stable flavored builds,
 * but there is no reason that the internal argument list can't contain the extra (and unused) dependency on a new selector.
 */
export type MyExtensibleSelector = (
  state: DummyState,
  props: DummyProps
) => {
  memoizedA: boolean;
  memoizedB: boolean;
  /* @conditional-compile-remove-from(stable) */
  memoizedC: boolean;
};

/**
 * Selector for {@link MicrophoneButton} component.
 *
 * @public
 */
export const myExtensibleSelector: MyExtensibleSelector = dummyCreateSelector(
  [memoizedBoolean, memoizedBoolean, memoizedBoolean],
  (a, b, c) => {
    return {
      memoizedA: a,
      memoizedB: b,
      /* @conditional-compile-remove-from(stable) */
      memoizedC: c
    };
  }
);

/**
 * Dummy types and functions needed for the selector example.
 *
 * No conditional compilation here.
 */
type DummyState = {};
type DummyProps = {};
function memoizedBoolean(state: DummyState, props: DummyProps) {
  console.log(state, props);
  return true;
}

function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean }
): (state: DummyState, props: DummyProps) => { memoizedA: boolean; memoizedB: boolean };
function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean }
): (state: DummyState, props: DummyProps) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean };
function dummyCreateSelector(
  dependencySelectors: [
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean,
    (state: DummyState, props: DummyProps) => boolean
  ],
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean; memoizedC?: boolean }
) {
  return (state: DummyState, props: DummyProps) => {
    return func(
      dependencySelectors[0](state, props),
      dependencySelectors[1](state, props),
      dependencySelectors[2](state, props)
    );
  };
}
