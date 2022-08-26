// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useState } from 'react';

import { QueryArgs } from './QueryArgs';
import { MockCallAdapter } from '../lib/MockCallAdapter';
import { useFakeChatAdapters } from '../lib/useFakeChatAdapters';
import type { CallAdapter } from '../../../src';
import { _createAzureCommunicationCallWithChatAdapterFromAdapters } from '../../../src';
import { FakeChatAdapterArgs, MockCallAdapterState } from '../../common';
import { BaseApp } from './BaseApp';

/**
 * A hermetic test application
 *
 *   ... that is not yet implemented.
 *
 */
export function HermeticApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs } = props;
  if (!queryArgs.fakeChatAdapterArgs) {
    return (
      <h3>
        ERROR: <code>fakeChatAdapterArgs</code> is unset.
      </h3>
    );
  }
  if (!queryArgs.mockCallAdapterState) {
    return (
      <h3>
        ERROR: <code>mockCallAdapterState</code> is unset.
      </h3>
    );
  }
  return (
    <HermeticAppImpl
      queryArgs={queryArgs}
      fakeChatAdapterArgs={queryArgs.fakeChatAdapterArgs}
      mockCallAdapterState={queryArgs.mockCallAdapterState}
    />
  );
}

function HermeticAppImpl(props: {
  queryArgs: QueryArgs;
  fakeChatAdapterArgs: FakeChatAdapterArgs;
  mockCallAdapterState: MockCallAdapterState;
}): JSX.Element {
  const { queryArgs, fakeChatAdapterArgs, mockCallAdapterState } = props;

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);
  useEffect(() => {
    (async (): Promise<void> => {
      console.log('Creating mock adapter with args', mockCallAdapterState);
      setCallAdapter(new MockCallAdapter(mockCallAdapterState));
    })();
  }, [mockCallAdapterState]);

  const chatAdapters = useFakeChatAdapters(fakeChatAdapterArgs);
  const callWithChatAdapter = useMemo(
    () =>
      !!callAdapter && !!chatAdapters?.local
        ? _createAzureCommunicationCallWithChatAdapterFromAdapters(callAdapter, chatAdapters.local)
        : undefined,
    [callAdapter, chatAdapters]
  );

  return <BaseApp queryArgs={queryArgs} adapter={callWithChatAdapter} />;
}

/** @internal */
export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  return !!queryArgs.fakeChatAdapterArgs && !!queryArgs.mockCallAdapterState;
}
