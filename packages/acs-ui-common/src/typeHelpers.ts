// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './areEqual';

/**
 * Remove all `undefined` union members from a union type.
 *
 * If the resulting type is `never` (i.e. the members were all `undefined`)
 * the overall type is also returned to be `undefined`.
 *
 * @public
 */
export type FilterUndefined<T> = Exclude<T, undefined> extends never ? undefined : Exclude<T, undefined>;
