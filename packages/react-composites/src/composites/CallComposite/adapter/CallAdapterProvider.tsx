// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { createContext, useContext } from 'react';
import { CommonCallAdapter } from './CallAdapter';

type CallProviderProps = {
  children: React.ReactNode;
  adapter: CommonCallAdapter;
};

const CallAdapterContext = createContext<CommonCallAdapter | undefined>(undefined);

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
export const useAdapter = (): CommonCallAdapter => {
  const adapter = useContext(CallAdapterContext);
  if (!adapter) {
    throw 'Cannot find adapter please initialize before usage.';
  }
  return adapter;
};
