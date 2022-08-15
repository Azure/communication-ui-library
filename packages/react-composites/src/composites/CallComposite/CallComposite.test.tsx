// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MockCallAdapter } from './MockCallAdapter';
import { CallComposite } from './CallComposite';

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

  test('Audio and video device permission should be requested for Presenter role', async () => {
    if (isTestProfileStableFlavor()) {
      return;
    }
    mount(<CallComposite adapter={adapter} role={'Presenter'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  test('Audio and video device permission should be requested for Attendee role', async () => {
    if (isTestProfileStableFlavor()) {
      return;
    }
    mount(<CallComposite adapter={adapter} role={'Attendee'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(1);
  });

  test('Only audio device permission should be requested for Consumer role', async () => {
    if (isTestProfileStableFlavor()) {
      return;
    }
    mount(<CallComposite adapter={adapter} role={'Consumer'} />);
    expect(audioDevicePermissionRequests).toBe(1);
    expect(videoDevicePermissionRequests).toBe(0);
  });
});

export const isTestProfileStableFlavor = (): boolean => {
  const flavor = process.env?.['COMMUNICATION_REACT_FLAVOR'];
  if (flavor === 'stable') {
    return true;
  } else if (flavor === 'beta') {
    return false;
  } else {
    throw 'Faled to find Communication React Flavor env variable';
  }
};
