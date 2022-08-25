// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { QueryArgs } from './QueryArgs';

/**
 * A hermetic test application
 *
 *   ... that is not yet implemented.
 *
 */
export function HermeticApp(props: { queryArgs: QueryArgs }): JSX.Element {
  throw new Error(`Unimplemented, though you tried to render ${JSON.stringify(props.queryArgs)}`);
}

/** @internal */
export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  // Just uset the argument somehow for now.
  if (queryArgs.displayName === 'xkcd') {
    console.log(queryArgs.displayName);
  }
  return false;
}
