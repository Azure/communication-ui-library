// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithPermissions } from '../components/utils/testUtils';
import { CameraButton, ControlBarButton } from '../components';
import { _getPermissions, _Permissions } from './PermissionsProvider';
import { registerIcons } from '@fluentui/react';

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

describe('PermissionProvider tests for camera by passing mock permissions', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttoncameraoff: <></>,
        chevrondown: <></>,
        controlbuttoncameraon: <></>
      }
    });
  });
  test('Camera button is enabled for prsenter role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, mockPresenterPermissions);
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(false);
  });
  test('Camera button is enabled for Attendee role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, mockAttendeePermissions);
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(false);
  });

  test('Camera button is disabled for Consumer role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, mockConsumerPermissions);
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(true);
  });
});

describe('PermissionProvider tests for different roles', () => {
  test('Test permissions object for presenter', async () => {
    expect(_getPermissions('Presenter')).toEqual(mockPresenterPermissions);
  });
  test('Test permissions object for attendee', async () => {
    expect(_getPermissions('Attendee')).toEqual(mockAttendeePermissions);
  });
  test('Test permissions object for presenter', async () => {
    expect(_getPermissions('Consumer')).toEqual(mockConsumerPermissions);
  });
});
