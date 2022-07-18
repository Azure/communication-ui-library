// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';

import { CallAdapter } from '../../../../src';
import { MockCallAdapter } from './mocks/MockCallAdapter';
import { QueryArgs } from './QueryArgs';
import { BaseApp } from './BaseApp';

/**
 * A hermetic test application that simpy loads the given static `{@link mockCallAdapterState}.
 *
 * Most {@link CallAdapter} methods are stubbed out.
 */
export function HermeticApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs } = props;

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    (async (): Promise<void> => {
      console.log('Creating mock adapter with args', queryArgs.mockCallState, queryArgs.mockCallAdapterState);
      setCallAdapter(new MockCallAdapter(queryArgs.mockCallState, queryArgs.mockCallAdapterState));
    })();
  }, [queryArgs.mockCallState, queryArgs.mockCallAdapterState]);

  return <BaseApp queryArgs={queryArgs} callAdapter={callAdapter} />;
}

/** @internal */
export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  return !!queryArgs.mockCallState || !!queryArgs.mockCallAdapterState;
}
