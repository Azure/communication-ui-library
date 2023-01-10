// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * @internal
 */
export type _UserProfileFunction = {
  onFetchProfile?: (userId: string) => Promise<UserProfile | undefined>;
};

/**
 * @internal
 */
export type UserProfile = {
  userId: string;
  displayName?: string;
};

/**
 * @internal
 */
export const UserProfileContext = createContext<_UserProfileFunction>({
  onFetchProfile: undefined
});

/**
 * Props for {@link _PermissionsProviderProps}.
 *
 * @internal
 */
export type _UserProfileProviderProps = {
  /** Permission context to provide components */
  onFetchProfile?: (userId: string) => Promise<UserProfile | undefined>;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @internal
 */
export const _UserProfileProvider = (props: _UserProfileProviderProps): JSX.Element => {
  const { onFetchProfile, children } = props;
  return <UserProfileContext.Provider value={{ onFetchProfile }}>{children}</UserProfileContext.Provider>;
};

/**
 * @internal
 * React hook to access permissions
 */
export const _useUserProfile = (userId: string): UserProfile | undefined => {
  const onFetchUserProfile = useContext(UserProfileContext).onFetchProfile;
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);

  useEffect(() => {
    if (!onFetchUserProfile) {
      return;
    }
    onFetchUserProfile(userId).then((profile) => setProfile(profile));
  }, [onFetchUserProfile, userId]);

  return profile;
};
