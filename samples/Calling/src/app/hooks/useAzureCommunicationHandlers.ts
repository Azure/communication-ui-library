// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createDefaultCallingHandlers } from '@azure/acs-calling-selector';
import { useCallAgent, useCallClient, useDeviceManager, useCall } from 'react-composites';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useAzureCommunicationHandlers = () => {
  return createDefaultCallingHandlers(useCallClient(), useCallAgent(), useDeviceManager(), useCall());
};
