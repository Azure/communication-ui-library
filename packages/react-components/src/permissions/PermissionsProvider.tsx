// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

/**
 * @internal
 */
export type Permissions = {
  cameraButton: boolean; // or 'disabled'/'hide'?
  microphoneButton: boolean;
  screenShare: boolean;
  participantList: boolean;
};

/**
 * @internal
 */
export const presenterPermissions: Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  participantList: true
};

/**
 * @internal
 */
export const consumerPermissions: Permissions = {
  cameraButton: false,
  microphoneButton: false,
  screenShare: false,
  participantList: false
};

/**
 * @internal
 */
export const PermissionsContext = createContext<Permissions>(presenterPermissions);

/**
 * Props for {@link PermissionsProviderProps}.
 *
 * @internal
 */
export type PermissionsProviderProps = {
  /** Permission context to provide components */
  permissions: Permissions;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @internal
 */
export const PermissionsProvider = (props: PermissionsProviderProps): JSX.Element => {
  const { permissions, children } = props;
  return <PermissionsContext.Provider value={permissions}>{children}</PermissionsContext.Provider>;
};

/** React hook to access permissions */
export const usePermissions = (): Permissions => useContext(PermissionsContext);
