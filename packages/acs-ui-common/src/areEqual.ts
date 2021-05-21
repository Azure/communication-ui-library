// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
