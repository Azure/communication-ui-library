// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect } from 'react';
import {
  AzureClient,
  AzureFunctionTokenProvider,
  AzureConnectionConfig,
  AzureContainerServices
} from '@fluidframework/azure-client';
import { SharedMap, ISharedMap, FluidContainer } from 'fluid-framework';
import { configDetails } from './env';

const containerSchema = {
  initialObjects: { myMap: SharedMap }
};

const createFluidContainer = async (
  client: AzureClient
): Promise<{
  container: FluidContainer;
  services: AzureContainerServices;
}> => await client.createContainer(containerSchema);

/**
 * @private
 */
export const FluidComponent = (): JSX.Element => {
  const [fluidMap, setFluidMap] = React.useState<ISharedMap | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const config: AzureConnectionConfig = {
        tenantId: configDetails.tenantId,
        tokenProvider: new AzureFunctionTokenProvider(configDetails.tokenProviderId, {
          userId: 'UserId',
          userName: 'Test User'
        }),
        orderer: configDetails.orderer,
        storage: configDetails.storage
      };

      const client = new AzureClient({ connection: config });

      const { container } = await createFluidContainer(client);
      const map = container.initialObjects.myMap as ISharedMap;
      map.set('myFirstCounter', 0);
      const id = await container.attach();
      console.log(id);
      window.location.hash = id;
      setFluidMap(map);
    })();
  }, []);

  useEffect(() => {
    fluidMap?.set('myFirstCounter', 1);
  }, [fluidMap]);

  return <>{`FluidMap value: ${fluidMap?.get('myFirstCounter')}`}</>;
};
