// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { User } from '@microsoft/microsoft-graph-types';
import { Providers } from '@microsoft/mgt-element';
import { useEffect, useState } from 'react';
import { _useIsSignedIn } from './useIsSignedIn';

/** @public */
export const _useMe = (): [User | undefined] => {
  const [me, setMe] = useState<User | undefined>();

  const [isSignedIn] = _useIsSignedIn();

  useEffect(() => {
    if (isSignedIn) {
      // Quickly throw into an async block.
      // TODO: this would not work in production code
      (async () => {
        const newMe = await Providers.me();
        setMe(newMe);
      })();
    }
  }, [isSignedIn]);

  return [me];
};
