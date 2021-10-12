// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import { AzureClient, AzureConnectionConfig, AzureContainerServices } from '@fluidframework/azure-client';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap, ISharedMap, FluidContainer } from 'fluid-framework';
import { configDetails } from './env';
import { InsecureTokenProvider } from '@fluidframework/test-client-utils';

const USE_LOCAL_FLUID_SERVER = false;

const containerSchema = {
  initialObjects: { myMap: SharedMap }
};

const config: AzureConnectionConfig = {
  tenantId: configDetails.tenantId,
  tokenProvider: new InsecureTokenProvider(configDetails.tokenProviderId, { id: 'UserId' }),
  orderer: configDetails.orderer,
  storage: configDetails.storage
};

const createFluidContainer = async (
  client: AzureClient | TinyliciousClient
): Promise<{
  container: FluidContainer;
  services: AzureContainerServices;
}> => await client.createContainer(containerSchema);

const initializeFluidMap = async (
  client: AzureClient | TinyliciousClient
): Promise<{ map: ISharedMap; containerId: string }> => {
  const { container } = await createFluidContainer(client);
  const map = container.initialObjects.myMap as ISharedMap;

  const id = await container.attach();
  return { map, containerId: id };
};

/**
 * @private
 */
export const FluidComponent = (): JSX.Element => {
  const [fluidMap, setFluidMap] = React.useState<ISharedMap | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const client = USE_LOCAL_FLUID_SERVER ? new TinyliciousClient() : new AzureClient({ connection: config });
      const { map, containerId } = await initializeFluidMap(client);

      window.location.hash = containerId;

      setFluidMap(map);
    })();
  }, []);

  useEffect(() => {
    fluidMap?.set('myFirstCounter', 1);
  }, [fluidMap]);

  return <>{`FluidMap value: ${fluidMap?.get('myFirstCounter')}`}</>;
};
