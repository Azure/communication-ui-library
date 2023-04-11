// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

/**
 * @internal
 */
export type _Permissions = {
  cameraButton: boolean; // or 'disabled'/'hide'?
  microphoneButton: boolean;
  screenShare: boolean;
  removeParticipantButton: boolean;
  role?: Role;
};

/**
 * @internal
 */
export const defaultPermissions: _Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  removeParticipantButton: true
};

/**
 * @internal
 */
export const presenterPermissions: _Permissions = {
  role: 'Presenter',
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  removeParticipantButton: true
};

/**
 * @internal
 */
export const consumerPermissions: _Permissions = {
  role: 'Consumer',
  cameraButton: false,
  microphoneButton: false,
  screenShare: false,
  removeParticipantButton: false
};

/**
 * @internal
 */
export const attendeePermissions: _Permissions = {
  role: 'Attendee',
  cameraButton: true,
  microphoneButton: true,
  screenShare: false,
  removeParticipantButton: false
};

/**
 * @internal
 */
export const PermissionsContext = createContext<_Permissions>(defaultPermissions);

/**
 * Props for {@link _PermissionsProviderProps}.
 *
 * @internal
 */
export type _PermissionsProviderProps = {
  /** Permission context to provide components */
  permissions: _Permissions;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @internal
 */
export const _PermissionsProvider = (props: _PermissionsProviderProps): JSX.Element => {
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
 * The role of a call participant.
 */
export type Role = 'Presenter' | 'Attendee' | 'Consumer' | 'Organizer' | 'Co-organizer';

/**
 * @internal
 */
export const _getPermissions = (role?: Role): _Permissions => {
  if (role === 'Consumer') {
    return consumerPermissions;
  } else if (role === 'Attendee') {
    return attendeePermissions;
  } else if (role === 'Presenter') {
    return presenterPermissions;
  }
  return defaultPermissions;
};
