// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MockCallAdapter } from './MockCallAdapter';
import { CallComposite } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
import { CallPermissionOptions } from './CallComposite';

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

describe('CallComposite device permission test for different call permission options', () => {
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
  ): CallPermissionOptions => {
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

  test('Audio and video device permission should be requested when no role is assigned', async () => {
    mount(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for Presenter role', async () => {
    mount(<CallComposite adapter={adapter} options={{ permissions: permissionSettings('required', 'required') }} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for Attendee role', async () => {
    mount(<CallComposite adapter={adapter} options={{ permissions: permissionSettings('optional', 'optional') }} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for Attendee role', async () => {
    mount(
      <CallComposite adapter={adapter} options={{ permissions: permissionSettings('doNotPrompt', 'doNotPrompt') }} />
    );
    expect(audioDevicePermissionRequests).toBe(0);
    expect(videoDevicePermissionRequests).toBe(0);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for Attendee role', async () => {
    mount(<CallComposite adapter={adapter} options={{ permissions: permissionSettings('optional', 'doNotPrompt') }} />);
    expect(audioDevicePermissionRequests).toBe(0);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  /* @conditional-compile-remove(call-readiness) */
  test('Audio and video device permission should be requested for Attendee role', async () => {
    mount(<CallComposite adapter={adapter} options={{ permissions: permissionSettings('doNotPrompt', 'optional') }} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(0);
  });
});
