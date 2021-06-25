// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatThreadClient } from '@azure/communication-chat';

// This file only exists so that it can be ignored via .prettierignore
// TODO: Bump prettier to >=2.2.0 to handle template literal types correctly.
//       Then merge this file into parent.

export type ObjectMethodNames<TName extends string, T> = {
  // eslint-disable-next-line prettier/prettier
  [K in keyof T]: `${TName}.${MethodName<T, K>}`;
}[keyof T];

// eslint complains on all uses of `Function`. Using it as a type constraint is legitimate.
// eslint-disable-next-line @typescript-eslint/ban-types
export type MethodName<T, K extends keyof T> = T[K] extends Function ? (K extends string ? K : never) : never;

export type ErrorTargets =
  | ObjectMethodNames<'ChatClient', ChatClient>
  | ObjectMethodNames<'ChatThreadClient', ChatThreadClient>;
