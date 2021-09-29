// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { CallAdapter } from './CallAdapter';

type CallProviderProps = {
  children: React.ReactNode;
  adapter: CallAdapter;
};

const CallAdapterContext = createContext<CallAdapter | undefined>(undefined);

/**
 * @private
 */
export const CallAdapterProvider = (props: CallProviderProps): JSX.Element => {
  const { adapter } = props;
  return <CallAdapterContext.Provider value={adapter}>{props.children}</CallAdapterContext.Provider>;
};

/**
 * @private
 */
export const useAdapter = (): CallAdapter => {
  const adapter = useContext(CallAdapterContext);
  if (!adapter) throw 'Cannot find adapter please initialize before usage.';
  return adapter;
};
