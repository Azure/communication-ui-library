// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import Enzyme from 'enzyme';
import { renderHook } from '@testing-library/react-hooks';
import Adapter from 'enzyme-adapter-react-16';
import { PermissionsProvider, _getPermissions, _Permissions, _usePermissions } from './PermissionsProvider';

Enzyme.configure({ adapter: new Adapter() });

const mockPresenterPermissions: _Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: true,
  participantList: true,
  removeParticipantButton: true
};

const mockConsumerPermissions: _Permissions = {
  cameraButton: false,
  microphoneButton: false,
  screenShare: false,
  participantList: false,
  removeParticipantButton: false
};

const mockAttendeePermissions: _Permissions = {
  cameraButton: true,
  microphoneButton: true,
  screenShare: false,
  participantList: true,
  removeParticipantButton: false
};

describe('Tests for permission provider hook by passing mock permissions', () => {
  test('Test _usepermissions for presenter', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <PermissionsProvider permissions={mockPresenterPermissions}>{children}</PermissionsProvider>
    );
    const { result } = renderHook(() => _usePermissions(), { wrapper });
    expect(result.current).toEqual(mockPresenterPermissions);
  });
  test('Test _usepermissions for attendee', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <PermissionsProvider permissions={mockAttendeePermissions}>{children}</PermissionsProvider>
    );
    const { result } = renderHook(() => _usePermissions(), { wrapper });
    expect(result.current).toEqual(mockAttendeePermissions);
  });
  test('Test _usepermissions for consumer', async () => {
    const wrapper = ({ children }): React.ReactElement => (
      <PermissionsProvider permissions={mockConsumerPermissions}>{children}</PermissionsProvider>
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
