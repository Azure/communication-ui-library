// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useState } from 'react';

import { CommonQueryArgs, HermeticQueryArgs, QueryArgs } from './QueryArgs';
import { MockCallAdapter } from '../lib/MockCallAdapter';
import type { CallAdapter } from '../../../src';
import { _createAzureCommunicationCallWithChatAdapterFromAdapters, _useFakeChatAdapters } from '../../../src';
import { BaseApp } from './BaseApp';
import { HiddenChatComposites } from '../lib/HiddenChatComposites';

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
  return <HermeticAppImpl queryArgs={queryArgs as HermeticQueryArgs & CommonQueryArgs} />;
}

function HermeticAppImpl(props: { queryArgs: HermeticQueryArgs & CommonQueryArgs }): JSX.Element {
  const { queryArgs: args } = props;

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);
  useEffect(() => {
    (async (): Promise<void> => {
      console.log('Creating mock adapter with args', args.mockCallAdapterState);
      setCallAdapter(new MockCallAdapter(args.mockCallAdapterState));
    })();
  }, [args.mockCallAdapterState]);

  const chatAdapters = _useFakeChatAdapters(args.fakeChatAdapterArgs);
  const callWithChatAdapter = useMemo(
    () =>
      !!callAdapter && !!chatAdapters?.local
        ? _createAzureCommunicationCallWithChatAdapterFromAdapters(callAdapter, chatAdapters.local)
        : undefined,
    [callAdapter, chatAdapters]
  );

  return (
    <>
      <HiddenChatComposites adapters={chatAdapters?.remotes ?? []} />
      <BaseApp queryArgs={args} adapter={callWithChatAdapter} />
    </>
  );
}

/** @internal */
export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  return !!queryArgs.fakeChatAdapterArgs && !!queryArgs.mockCallAdapterState;
}
