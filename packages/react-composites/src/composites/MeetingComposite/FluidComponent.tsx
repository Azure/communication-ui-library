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

function throwIfNotFound<T>(param: T, name: string): T {
  if (!param) throw new Error(`${name} not found in env file`);
  return param;
}

const config: AzureConnectionConfig = {
  tenantId: throwIfNotFound(process.env.tenantId, 'tenantId') ?? '',
  tokenProvider: new AzureFunctionTokenProvider(throwIfNotFound(process.env.tokenProvider, 'tokenProvider') ?? '', {
    userId: 'UserId',
    userName: 'Test User'
  }),
  orderer: throwIfNotFound(process.env.orderer, 'orderer') ?? '',
  storage: throwIfNotFound(process.env.storage, 'storage') ?? ''
};

const client = new AzureClient({ connection: config });

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
    async () => {
      const { container } = await createFluidContainer(client);
      container.initialObjects.myMap.set('firstflag', true);
      const id = await container.attach();
      window.location.hash = id;
    };
  }, []);

  return <>{'This is the fluid component'}</>;
};
