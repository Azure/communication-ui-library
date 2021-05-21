// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createDefaultCallingHandlers,
  useCall,
  useCallAgent,
  useCallClient,
  useDeviceManager
} from '@azure/acs-calling-selector';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useAzureCommunicationHandlers = () => {
  return createDefaultCallingHandlers(useCallClient(), useCallAgent(), useDeviceManager(), useCall());
};
