// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

const GraphToolkitEnabledContext = createContext(true);

/** @internal */
export const _GraphToolkitEnabledProvider = (props: { isEnabled: boolean; children: React.ReactNode }): JSX.Element => {
  return (
    <GraphToolkitEnabledContext.Provider value={props.isEnabled}>{props.children}</GraphToolkitEnabledContext.Provider>
  );
};

/** @internal */
export const _useGraphToolkitEnabled = (): [boolean] => [useContext(GraphToolkitEnabledContext)];
