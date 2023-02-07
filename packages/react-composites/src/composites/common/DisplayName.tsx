// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { OnFetchProfileCallback } from './Profile';

type DisplayNameProps = {
  userId: string;
  displayName?: string;
  onFetchProfile?: OnFetchProfileCallback;
};

/** private */
export const DisplayName = (props: DisplayNameProps): JSX.Element => {
  const { userId, displayName, onFetchProfile } = props;
  const [name, setName] = useState(displayName);

  useEffect(() => {
    if (onFetchProfile) {
      onFetchProfile(userId).then((profile) => {
        setName(profile?.displayName);
      });
    }
  }, [userId, onFetchProfile]);

  return <>{name}</>;
};
