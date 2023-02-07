// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';

type DisplayNameOverrideExampleProps = {
  userId: string;
  displayName?: string;
  onFetchProfile?: (userId: string) => Promise<{ displayName?: string } | undefined>;
};

// This is an example to show how to override DisplayName using a fetch function
export const DisplayNameOverrideExample = (props: DisplayNameOverrideExampleProps): JSX.Element => {
  const { userId, displayName, onFetchProfile } = props;
  const [name, setName] = useState(displayName);

  useEffect(() => {
    // fetch-and-forget pattern to avoid unnecessary re-render
    if (!name && onFetchProfile) {
      onFetchProfile(userId).then((profile) => {
        setName(profile?.displayName);
      });
    }
  }, [userId, onFetchProfile, name]);

  return <>{name}</>;
};
