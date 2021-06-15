// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createDefaultCallingHandlers,
  useCall,
  useCallAgent,
  useCallClient,
  useDeviceManager
} from 'calling-component-bindings';

export const useAzureCommunicationHandlers = (): any => {
  return createDefaultCallingHandlers(useCallClient(), useCallAgent(), useDeviceManager(), useCall());
};
