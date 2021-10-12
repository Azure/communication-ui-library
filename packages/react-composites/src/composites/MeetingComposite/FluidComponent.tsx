// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import { ISharedMap } from 'fluid-framework';
import { createFluidClient, initializeFluidMap } from './FluidUtils';

const FLUID_COUNTER_KEY = 'myFirstCounter';

/**
 * @private
 */
export const FluidComponent = (): JSX.Element => {
  const [fluidMap, setFluidMap] = React.useState<ISharedMap | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const client = createFluidClient();
      const map = await initializeFluidMap(client, window.location.search);
      setFluidMap(map);
    })();
  }, []);

  useEffect(() => {
    const oldVal = fluidMap?.get(FLUID_COUNTER_KEY) || 1;
    // DON'T DO THIS.
    fluidMap?.set(FLUID_COUNTER_KEY, oldVal + 1);
  }, [fluidMap]);

  return <>{`FluidMap value: ${fluidMap?.get(FLUID_COUNTER_KEY)}`}</>;
};
