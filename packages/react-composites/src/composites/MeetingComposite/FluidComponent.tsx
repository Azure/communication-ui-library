// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useMemo } from 'react';
import {
  AzureClient,
  AzureFunctionTokenProvider,
  AzureConnectionConfig,
  AzureContainerServices
} from '@fluidframework/azure-client';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap, ISharedMap, FluidContainer } from 'fluid-framework';
import { configDetails } from './env';

const USE_LOCAL_FLUID_SERVER = true;

const containerSchema = {
  initialObjects: { myMap: SharedMap }
};

const createFluidContainer = async (
  client: AzureClient | TinyliciousClient
): Promise<{
  container: FluidContainer;
  services: AzureContainerServices;
}> => await client.createContainer(containerSchema);

/**
 * @private
 */
export const FluidComponent = (): JSX.Element => {
  const [fluidMap, setFluidMap] = React.useState<ISharedMap | undefined>(undefined);

  const client = useMemo(() => {
    const config: AzureConnectionConfig = {
      tenantId: configDetails.tenantId,
      tokenProvider: new AzureFunctionTokenProvider(configDetails.tokenProviderId, {
        userId: 'UserId',
        userName: 'Test User'
      }),
      orderer: configDetails.orderer,
      storage: configDetails.storage
    };

    return USE_LOCAL_FLUID_SERVER ? new TinyliciousClient() : new AzureClient({ connection: config });
  }, []);

  useEffect(() => {
    if (client) {
      (async () => {
        const { container } = await createFluidContainer(client);
        const map = container.initialObjects.myMap as ISharedMap;
        map.set('myFirstCounter', 0);
        const id = await container.attach();
        console.log(id);
        window.location.hash = id;
        setFluidMap(map);
      })();
    }
  }, [client]);

  useEffect(() => {
    fluidMap?.set('myFirstCounter', 1);
  }, [fluidMap]);

  return <>{`FluidMap value: ${fluidMap?.get('myFirstCounter')}`}</>;
};
