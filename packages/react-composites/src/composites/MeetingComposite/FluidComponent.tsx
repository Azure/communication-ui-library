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
const URL_PARAM_KEY = 'fluidContainerId';

const containerSchema = {
  initialObjects: { myMap: SharedMap }
};

const config: AzureConnectionConfig = {
  tenantId: configDetails.tenantId,
  tokenProvider: new AzureFunctionTokenProvider(configDetails.tokenProviderId, {
    userId: 'UserId',
    userName: 'Test User'
  }),
  orderer: configDetails.orderer,
  storage: configDetails.storage
};

const createFluidContainer = async (
  client: AzureClient | TinyliciousClient
): Promise<{
  container: FluidContainer;
  services: AzureContainerServices;
}> => await client.createContainer(containerSchema);

const initializeFluidMap = async (client: AzureClient | TinyliciousClient, urlParams: string): Promise<ISharedMap> => {
  const existingContainerId = getContainerIdIfExists(urlParams);
  if (existingContainerId) {
    const { container } = await client.getContainer(existingContainerId, containerSchema);
    return container.initialObjects.myMap as ISharedMap;
  }
  const { container } = await createFluidContainer(client);
  const map = container.initialObjects.myMap as ISharedMap;

  const containerId = await container.attach();

  // `window.location.search` already contains groupId etc.
  window.history.pushState(
    {},
    document.title,
    window.location.origin + window.location.search + `&${URL_PARAM_KEY}=${containerId}`
  );
  return map;
};

/**
 * @private
 */
export const FluidComponent = (): JSX.Element => {
  const [fluidMap, setFluidMap] = React.useState<ISharedMap | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const client = USE_LOCAL_FLUID_SERVER ? new TinyliciousClient() : new AzureClient({ connection: config });
      const map = await initializeFluidMap(client, window.location.search);
      setFluidMap(map);
    })();
  }, []);

  useEffect(() => {
    const oldVal = fluidMap?.get('myFirstCounter') || 1;
    // DON'T DO THIS.
    fluidMap?.set('myFirstCounter', oldVal + 1);
  }, [fluidMap]);

  return <>{`FluidMap value: ${fluidMap?.get('myFirstCounter')}`}</>;
};

const getContainerIdIfExists = (urlParams: string): string | undefined => {
  const params = new URLSearchParams(urlParams);
  return params.get(URL_PARAM_KEY) || undefined;
};
