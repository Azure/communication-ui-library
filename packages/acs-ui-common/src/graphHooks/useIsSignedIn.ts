// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Providers, ProviderState } from '@microsoft/mgt-element';
import { useEffect, useState } from 'react';
import { _useGraphToolkitEnabled } from './useGraphToolkitEnabled';

/** @public */
export const _useIsSignedIn = (): [boolean] => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [graphToolkitEnabled] = _useGraphToolkitEnabled();

  useEffect(() => {
    const updateState = (): void => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);

  return [graphToolkitEnabled && isSignedIn];
};
