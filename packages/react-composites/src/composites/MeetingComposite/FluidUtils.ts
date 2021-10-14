// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureClient, AzureConnectionConfig, AzureContainerServices } from '@fluidframework/azure-client';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { FluidContainer, IFluidContainer } from 'fluid-framework';
import { configDetails } from './env';
import { InsecureTokenProvider } from '@fluidframework/test-client-utils';
import { containerSchema } from './FluidModel';

const URL_PARAM_KEY = 'fluidContainerId';
const USE_LOCAL_FLUID_SERVER = false;

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
export const initializeFluidContainer = async (
  client: AzureClient | TinyliciousClient,
  urlParams: string
): Promise<IFluidContainer> => {
  const existingContainerId = getContainerIdIfExists(urlParams);
  if (existingContainerId) {
    const { container } = await client.getContainer(existingContainerId, containerSchema);
    return container;
  }

  const { container } = await createFluidContainer(client);
  updateUrl(await container.attach());
  return container;
};

const getContainerIdIfExists = (urlParams: string): string | undefined => {
  const params = new URLSearchParams(urlParams);
  return params.get(URL_PARAM_KEY) || undefined;
};

const updateUrl = (containerId: string): void => {
  // `window.location.search` already contains groupId etc.
  window.history.pushState(
    {},
    document.title,
    window.location.origin + window.location.search + `&${URL_PARAM_KEY}=${containerId}`
  );
};
