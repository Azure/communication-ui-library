// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Return intersect type of 2 types
 */
export type Common<A, B> = Pick<A, CommonProperties<A, B>>;

/**
 * Return intersect properties of 2 types
 */
export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? P : never;
}[keyof A & keyof B];
