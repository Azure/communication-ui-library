// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import * as utils from './utils';

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

/* eslint-disable jsdoc/require-jsdoc */

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
 * We do not support adding a parameter to a function _implementation_ signature.
 * But we do support conditional parameters in function overload signature.
 *
 * So there are two ways to achieve this:
 * - Add a single overload signature with conditional parameter: `f` in the example.
 * - Add a new overload signature with conditional paramter: `f` and `g` in the example.
 *
 * In each case, you must modify the implementation signature to satisfy all the overloads.
 * The example does this by adding `f` and `g` as optional parameters.
 *
 * cf: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads.
 */
export function d(e: number, /* @conditional-compile-remove-from(stable) */ f: number): void;
/* @conditional-compile-remove-from(stable) */
export function d(e: number, f: number, g: number): void;
export function d(e: number, f?: number, g?: number): void {
  console.log(e);
  /* @conditional-compile-remove-from(stable) */
  console.log(f, g);
}

/******************************************************************************
 *
 * Conditional business logic
 *
 */

/**
 * Call a function with conditional parameters.
 */
export function dCaller(): void {
  d(1, /* @conditional-compile-remove-from(stable) */ 2);
  d(1, /* @conditional-compile-remove-from(stable) */ 2, /* @conditional-compile-remove-from(stable) */ 3);

  // The following would stable flavor build because the function overload signature for `d` only allows one
  // argument in stable flavor.
  // d(1, 2, 3);
}

/**
 * Conditional inclusion of JSX components can be a bit tricky, because we must remove partial expressions.
 */
export function GottaHaveAnExtraStackItem(): JSX.Element {
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
export function OverrideSomePropInBeta(): JSX.Element {
  const flavorDependentProp = propTrampoline();
  return <h1 className={flavorDependentProp}>Nothing to see here!</h1>;
}
function propTrampoline(): string {
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
  state: utils.DummyState,
  props: utils.DummyProps
) => {
  memoizedA: boolean;
  memoizedB: boolean;
  /* @conditional-compile-remove-from(stable) */
  memoizedC: boolean;
};

export const myExtensibleSelector: MyExtensibleSelector = utils.dummyCreateSelector(
  [utils.memoizedBoolean, utils.memoizedBoolean, utils.memoizedBoolean],
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
 * Adding a new feature conditionally often involves a few operations together:
 * - Introduce a new @beta type
 * - Introduce a new internal class method that uses the @beta type
 * - Call the new @beta class method from @public API, but only in beta flavored build.
 *
 * Following the general guidelines stated above, we achieve this as follows:
 * - Unconditionally add the new type
 *   - Conditionally export the new type in the public API.
 * - Conditionally adding the new class method that uses the conditionally exposed type.
 * - In the @public method, extract a simple helper function that detects whether the @beta method should be called.
 *   The implementation of this function uses conditional compilation.
 *   - Call the method if needed. Because the method and type are defined unconditionally, no conditional
 *     compliation is needed here.
 */

type ThisIsUnstableType = string;
/* @conditional-compile-remove-from(stable) */
export type { ThisIsUnstableType };

class InternalImplementation {
  public goodOldTestedFunctionality(): void {
    /* Been doing this in stable flavor build for a decade */
  }
  public newMethodForUnstableFunctionality(arg: ThisIsUnstableType): string {
    /* Unstable, but amazingly awesome magic happens here */
    return arg;
  }
}

export function StableAPIThatGainsNewUnstableBehavior(): void {
  const impl = new InternalImplementation();
  impl.goodOldTestedFunctionality();
  if (shouldIncludeUnstableFeature()) {
    const arg: ThisIsUnstableType = 'getThisFromUser';
    impl.newMethodForUnstableFunctionality(arg);
  }
}

function shouldIncludeUnstableFeature(): boolean {
  /* @conditional-compile-remove-from(stable) */
  return true;
  return false;
}
