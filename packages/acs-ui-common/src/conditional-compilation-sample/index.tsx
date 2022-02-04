// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * This folder contains some simple examples using conditional compilation directive.
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
 *
 * General guidelines:
 * 1. Keep conditional compilation as small as possible.
 * 2. Keep conditional compilation encapsulated.
 * 3. Keep conditional compilation near package boundary.
 *   a. If the conditional compilation is in our exported API, try to quickly convert to a type that is not conditional.
 *      This will often simplify implementation.
 *   b. If the conditional compilation is to deal with a dependency, try to quickly fill in a default value so that you
 *      don't need conditional compilation at point-of-use.
 *
 * (1) is not always possible (depends on the feature you're working on), but (3) can help you make the footprint smaller, and
 * (2) can help you keep the footprint sane.
 *
 * Organization of this file:
 * - First let's talk types
 * - Then let's talk conditional business logic
 * - Finally, let's bring those together in some repeated patterns we see in this code-base.
 */

/******************************************************************************
 *
 * Conditional types
 *
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
 * Conditionally import from a package.
 */
/* @conditional-compile-remove-from(stable) */
import { Dir } from 'fs';

/**
 * Conditionally export from a module.
 */
/* @conditional-compile-remove-from(stable) */
export interface C {
  a: A;
  b: B;
}

/* @conditional-compile-remove-from(stable) */
export type MyDir = Dir;

/**
 * Conditionally add fields to an interface
 */
export interface B2 {
  sameOld: number;
  /* @conditional-compile-remove-from(stable) */
  somethingNew: number;
}

/**
 * Conditionally add variants to a type union
 *
 * Watchout: A common pitfall here is adding the conditional directive before the binary operator.
 */
export type Unionize = number | /* @conditional-compile-remove-from(stable) */ boolean;
export type Impossible = number & /* @conditional-compile-remove-from(stable) */ boolean;

/**
 * Add a parameter to an existing function
 *
 * FIXME: This doesn't yet work. `f` is not removed from the function signature, although it is removed from the function call in the body.
 */
export function d(e: number, /* @conditional-compile-remove-from(stable) */ f: number) {
  console.log(e);
  /* @conditional-compile-remove-from(stable) */
  console.log(f);
}

/******************************************************************************
 *
 * Conditional business logic
 *
 */

/**
 * Call a function with conditional parameters.
 *
 * FIXME: This doesn't yet work. `f` is not removed from the function signature, although it is removed from the function call in the body.
 */
export function dCaller() {
  // FIXME: Doesn't yet work, because `f` was not removed from the function signature.
  // d(1, /* @conditional-compile-remove-from(stable) */ 2);
}

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

/******************************************************************************
 *
 * Common complex patterns
 *
 */

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

/******************************************************************************
 *
 * Some helpers needed for examples above.
 *
 * No conditional compilation examples below this.
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
  func: (a: boolean, b: boolean, c: boolean) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean }
): (state: DummyState, props: DummyProps) => { memoizedA: boolean; memoizedB: boolean; memoizedC: boolean };
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
  func: (a: boolean, b: boolean, c: boolean) => unknown
) {
  return (state: DummyState, props: DummyProps) => {
    return func(
      dependencySelectors[0](state, props),
      dependencySelectors[1](state, props),
      dependencySelectors[2](state, props)
    );
  };
}
