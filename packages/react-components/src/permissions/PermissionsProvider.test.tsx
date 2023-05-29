// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { renderHook } from '@testing-library/react';
import { _PermissionsProvider, _getPermissions, _Permissions, _usePermissions } from './PermissionsProvider';

const mockPresenterPermissions: _Permissions = {
  role: 'Presenter',
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  removeParticipantButton: true
};

const mockConsumerPermissions: _Permissions = {
  role: 'Consumer',
  cameraButton: false,
  microphoneButton: false,
  screenShare: false,
  removeParticipantButton: false
};

const mockAttendeePermissions: _Permissions = {
  role: 'Attendee',
  cameraButton: true,
  microphoneButton: true,
  screenShare: false,
  removeParticipantButton: false
};

describe('Tests for permission provider hook by passing mock permissions', () => {
  test('Test _usepermissions for presenter', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <_PermissionsProvider permissions={mockPresenterPermissions}>{children}</_PermissionsProvider>
    );
    const { result } = renderHook(() => _usePermissions(), { wrapper });
    expect(result.current).toEqual(mockPresenterPermissions);
  });
  test('Test _usepermissions for attendee', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <_PermissionsProvider permissions={mockAttendeePermissions}>{children}</_PermissionsProvider>
    );
    const { result } = renderHook(() => _usePermissions(), { wrapper });
    expect(result.current).toEqual(mockAttendeePermissions);
  });
  test('Test _usepermissions for consumer', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <_PermissionsProvider permissions={mockConsumerPermissions}>{children}</_PermissionsProvider>
    );
    const { result } = renderHook(() => _usePermissions(), { wrapper });
    expect(result.current).toEqual(mockConsumerPermissions);
  });
});

describe('PermissionProvider tests for different roles', () => {
  test('Test permissions object for presenter', async () => {
    expect(_getPermissions('Presenter')).toEqual(mockPresenterPermissions);
  });
  test('Test permissions object for attendee', async () => {
    expect(_getPermissions('Attendee')).toEqual(mockAttendeePermissions);
  });
  test('Test permissions object for consumer', async () => {
    expect(_getPermissions('Consumer')).toEqual(mockConsumerPermissions);
  });
});
