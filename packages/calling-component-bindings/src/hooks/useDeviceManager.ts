// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatefulDeviceManager } from '@internal/calling-stateful-client';
import { useContext } from 'react';
import { MediaClientContext } from '../providers/MediaClientProvider';
import { CallClientContext } from '../providers';

/**
 * Hook to obtain {@link StatefulDeviceManager} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @remarks
 * You must have this hook be used inside a {@link CallClientProvider} or {@link MediaClientProvider}.
 *
 * @public
 */
export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  const callClientContext = useContext(CallClientContext);
  const mediaClientContext = useContext(MediaClientContext);
  return callClientContext?.deviceManager ?? mediaClientContext?.deviceManager;
};
