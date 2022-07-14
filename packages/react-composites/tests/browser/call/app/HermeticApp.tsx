// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';

import { CallAdapter } from '../../../../src';
import { MockCallAdapter } from './mocks/MockCallAdapter';
import { QueryArgs } from './QueryArgs';
import { BaseApp } from './BaseApp';

export function HermeticApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs } = props;

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    (async (): Promise<void> => {
      setCallAdapter(new MockCallAdapter(queryArgs.mockCallState, queryArgs.mockCallAdapterState));
    })();
  }, [queryArgs.mockCallState]);

  return <BaseApp queryArgs={queryArgs} callAdapter={callAdapter} />;
}

export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  return !!queryArgs.mockCallState || !!queryArgs.mockCallAdapterState;
}
