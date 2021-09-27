// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compare if two types are equal, result type will be true/false
 *
 * @public
 */
export type AreTypeEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

/**
 * Compare if props of 2 react components are equal, result type will be true/false
 *
 * @public
 */
export type AreParamEqual<
  A extends (props: any) => JSX.Element | undefined,
  B extends (props: any) => JSX.Element | undefined
> = AreTypeEqual<Required<Parameters<A>[0]>, Required<Parameters<B>[0]>>;

/**
 * Compare if 2 react components are exact equal, result type will be true/false
 *
 * @public
 */
export type AreEqual<
  A extends (props: any) => JSX.Element | undefined,
  B extends (props: any) => JSX.Element | undefined
> = true extends AreTypeEqual<A, B> & AreParamEqual<A, B> ? true : false;
