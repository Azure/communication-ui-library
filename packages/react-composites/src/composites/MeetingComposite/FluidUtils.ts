// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureClient, AzureConnectionConfig, AzureContainerServices } from '@fluidframework/azure-client';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap, ISharedMap, FluidContainer } from 'fluid-framework';
import { configDetails } from './env';
import { InsecureTokenProvider } from '@fluidframework/test-client-utils';

const URL_PARAM_KEY = 'fluidContainerId';
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

/**
 * @private
 */
export const createFluidClient = (): AzureClient | TinyliciousClient =>
  USE_LOCAL_FLUID_SERVER ? new TinyliciousClient() : new AzureClient({ connection: config });

const createFluidContainer = async (
  client: AzureClient | TinyliciousClient
): Promise<{
  container: FluidContainer;
  services: AzureContainerServices;
}> => await client.createContainer(containerSchema);

/**
 * @private
 */
export const initializeFluidMap = async (
  client: AzureClient | TinyliciousClient,
  urlParams: string
): Promise<ISharedMap> => {
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

const getContainerIdIfExists = (urlParams: string): string | undefined => {
  const params = new URLSearchParams(urlParams);
  return params.get(URL_PARAM_KEY) || undefined;
};
