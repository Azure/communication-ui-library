// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MockCallAdapter } from './MockCallAdapter';
import { CallComposite } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
import { DevicePermissionRestrictions } from './CallComposite';

Enzyme.configure({ adapter: new Adapter() });

describe('CallComposite device permission test for different roles', () => {
  let audioDevicePermissionRequests = 0;
  let videoDevicePermissionRequests = 0;

  const countDevicePermissionRequests = async (constrain: { audio: boolean; video: boolean }): Promise<void> => {
    if (constrain.video) {
      videoDevicePermissionRequests++;
    }
    if (constrain.audio) {
      audioDevicePermissionRequests++;
    }
  };
  const adapter = new MockCallAdapter({ askDevicePermission: countDevicePermissionRequests });

  beforeEach(() => {
    // Register icons used in CallComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });

    // Reset permission request counters to 0
    audioDevicePermissionRequests = 0;
    videoDevicePermissionRequests = 0;
  });

  test('Audio and video device permission should be requested when no role is assigned', async () => {
    mount(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(rooms) */
  test('Audio and video device permission should be requested for Presenter role', async () => {
    mount(<CallComposite adapter={adapter} role={'Presenter'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(rooms) */
  test('Audio and video device permission should be requested for Attendee role', async () => {
    mount(<CallComposite adapter={adapter} role={'Attendee'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(rooms) */
  test('Only audio device permission should be requested for Consumer role', async () => {
    mount(<CallComposite adapter={adapter} role={'Consumer'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(0);
  });
});

describe('CallComposite device permission test for different device permission options', () => {
  let audioDevicePermissionRequests = 0;
  let videoDevicePermissionRequests = 0;

  const countDevicePermissionRequests = async (constrain: { audio: boolean; video: boolean }): Promise<void> => {
    if (constrain.video) {
      videoDevicePermissionRequests++;
    }
    if (constrain.audio) {
      audioDevicePermissionRequests++;
    }
  };
  const adapter = new MockCallAdapter({ askDevicePermission: countDevicePermissionRequests });

  /* @conditional-compile-remove(call-readiness) */
  const permissionSettings = (
    camera: 'required' | 'optional' | 'doNotPrompt',
    microphone: 'required' | 'optional' | 'doNotPrompt'
  ): DevicePermissionRestrictions => {
    return { camera: camera, microphone: microphone };
  };

  beforeEach(() => {
    // Register icons used in CallComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });

    // Reset permission request counters to 0
    audioDevicePermissionRequests = 0;
    videoDevicePermissionRequests = 0;
  });

  test('Audio and video device permission should be requested when no devicePermission prompt is set', async () => {
    mount(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for devicePermission set to required', async () => {
    mount(
      <CallComposite adapter={adapter} options={{ devicePermissions: permissionSettings('required', 'required') }} />
    );
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for devicePermission set to optional', async () => {
    mount(
      <CallComposite adapter={adapter} options={{ devicePermissions: permissionSettings('optional', 'optional') }} />
    );
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for devicePermission set to doNotPrompt', async () => {
    mount(
      <CallComposite
        adapter={adapter}
        options={{ devicePermissions: permissionSettings('doNotPrompt', 'doNotPrompt') }}
      />
    );
    expect(audioDevicePermissionRequests).toBe(0);
    expect(videoDevicePermissionRequests).toBe(0);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Video device permission should be requested for Camera devicePermission set to required', async () => {
    mount(
      <CallComposite adapter={adapter} options={{ devicePermissions: permissionSettings('required', 'doNotPrompt') }} />
    );
    expect(audioDevicePermissionRequests).toBe(0);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio device permission should be requested for Microphone devicePermission set to required', async () => {
    mount(
      <CallComposite adapter={adapter} options={{ devicePermissions: permissionSettings('doNotPrompt', 'required') }} />
    );
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(0);
  });
});
