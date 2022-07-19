// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

/**
 * @internal
 */
export type _Permissions = {
  cameraButton: boolean;
  microphoneButton: boolean;
  screenShare: boolean;
  participantList: boolean;
};

/**
 * @internal
 */
export const presenterPermissions: _Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  participantList: true
};

/**
 * @internal
 */
export const consumerPermissions: _Permissions = {
  cameraButton: false,
  microphoneButton: false,
  screenShare: false,
  participantList: false
};

/**
 * @internal
 */
export const attendeePermissions: _Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: false,
  participantList: true
};

/**
 * @internal
 */
export const PermissionsContext = createContext<_Permissions>(presenterPermissions);

/**
 * Props for {@link PermissionsProviderProps}.
 *
 * @internal
 */
export type PermissionsProviderProps = {
  /** Permission context to provide components */
  permissions: _Permissions;
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

/**
 * @internal
 * React hook to access permissions
 */
export const _usePermissions = (): _Permissions => useContext(PermissionsContext);

/**
 * @beta
 */
export type Role = 'Presenter' | 'Attendee' | 'Consumer';

/**
 * @internal
 */
export const _getPermissions = (role?: Role): _Permissions => {
  if (role === 'Consumer') {
    return consumerPermissions;
  } else if (role === 'Attendee') {
    return attendeePermissions;
  } else {
    return presenterPermissions;
  }
};
