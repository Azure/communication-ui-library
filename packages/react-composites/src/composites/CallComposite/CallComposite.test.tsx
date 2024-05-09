// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIcons } from '@fluentui/react';
import React from 'react';
import { _MockCallAdapter } from './MockCallAdapter';
import { CallComposite } from './CallComposite';
import { render } from '@testing-library/react';

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
    const adapter = new _MockCallAdapter({ askDevicePermission: countDevicePermissionRequests });
    render(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  test('Audio and video device permission should be requested for Presenter role', async () => {
    const adapter = new _MockCallAdapter({
      askDevicePermission: countDevicePermissionRequests,
      localParticipantRole: 'Presenter'
    });
    render(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  test('Audio and video device permission should be requested for Attendee role', async () => {
    const adapter = new _MockCallAdapter({
      askDevicePermission: countDevicePermissionRequests,
      localParticipantRole: 'Attendee'
    });
    render(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  test('Only audio device permission should be requested for Consumer role', async () => {
    const adapter = new _MockCallAdapter({
      askDevicePermission: countDevicePermissionRequests,
      localParticipantRole: 'Consumer'
    });
    render(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(0);
  });
});

describe('CallComposite device permission test for call readiness', () => {
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
  const adapter = new _MockCallAdapter({ askDevicePermission: countDevicePermissionRequests });

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
    render(<CallComposite adapter={adapter} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });
});
