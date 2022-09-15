// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DevicesButton, DevicesButtonProps } from './DevicesButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';
import { setIconOptions } from '@fluentui/react';
/* @conditional-compile-remove(rooms) */
import { mountWithPermissions } from './utils/testUtils';
/* @conditional-compile-remove(rooms) */
import { _getPermissions } from '../permissions';
/* @conditional-compile-remove(rooms) */
import { ControlBarButton } from './ControlBarButton';
// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

Enzyme.configure({ adapter: new Adapter() });

const mockProps: DevicesButtonProps = {
  cameras: [{ id: 'camera1', name: 'testCamera' }],
  selectedCamera: { id: 'camera1', name: 'testCamera' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectCamera: async () => {},
  microphones: [{ id: 'microphone1', name: 'testMicrophone' }],
  selectedMicrophone: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectMicrophone: async () => {},
  speakers: [{ id: 'speaker1', name: 'testMicrophone' }],
  selectedSpeaker: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectSpeaker: async () => {}
};

describe('DevicesButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ devicesButton: { label: Math.random().toString() } });
    const component = mountWithLocalization(<DevicesButton showLabel={true} {...mockProps} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.devicesButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ devicesButton: { label: Math.random().toString() } });
    const devicesButtonStrings = { label: Math.random().toString() };
    const component = mountWithLocalization(
      <DevicesButton showLabel={true} {...mockProps} strings={devicesButtonStrings} />,
      testLocale
    );
    expect(component.text()).toBe(devicesButtonStrings.label);
  });
});

/* @conditional-compile-remove(rooms) */
describe('DeviceButton tests for different roles', () => {
  test('Camera, Speaker, and Microphone section in context menu are shown for Presenter role', async () => {
    const wrapper = mountWithPermissions(
      <DevicesButton showLabel={true} {...mockProps} />,
      _getPermissions('Presenter')
    );
    const deviceButton = wrapper.find(ControlBarButton).first();
    expect(deviceButton.prop('menuProps')?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'sectionCamera' }),
        expect.objectContaining({ key: 'sectionMicrophone' }),
        expect.objectContaining({ key: 'sectionSpeaker' })
      ])
    );
  });

  test('Camera, Speaker, and Microphone section in context menu are shown for Attendee role', async () => {
    const wrapper = mountWithPermissions(
      <DevicesButton showLabel={true} {...mockProps} />,
      _getPermissions('Attendee')
    );
    const deviceButton = wrapper.find(ControlBarButton).first();
    expect(deviceButton.prop('menuProps')?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'sectionCamera' }),
        expect.objectContaining({ key: 'sectionMicrophone' }),
        expect.objectContaining({ key: 'sectionSpeaker' })
      ])
    );
  });

  test('Camera and Microphone section in context menu are not shown for Consumer role', async () => {
    const wrapper = mountWithPermissions(
      <DevicesButton showLabel={true} {...mockProps} />,
      _getPermissions('Consumer')
    );
    const deviceButton = wrapper.find(ControlBarButton).first();
    expect(deviceButton.prop('menuProps')?.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: 'sectionSpeaker' })])
    );
  });
});
