// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(rooms) */
import { mountWithPermissions } from './utils/testUtils';
/* @conditional-compile-remove(rooms) */
import { _getPermissions } from '../permissions';
/* @conditional-compile-remove(rooms) */
import { ControlBarButton } from './ControlBarButton';
import { registerIcons } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('MicrophoneButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttonmicoff: <></>,
        chevrondown: <></>,
        controlbuttonmicon: <></>
      }
    });
  });
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      microphoneButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const component = mountWithLocalization(<MicrophoneButton showLabel={true} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.microphoneButton.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(testLocale.strings.microphoneButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      microphoneButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const microphoneButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const component = mountWithLocalization(
      <MicrophoneButton strings={microphoneButtonStrings} showLabel={true} />,
      testLocale
    );
    expect(component.text()).toBe(microphoneButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(microphoneButtonStrings.onLabel);
  });
});

/* @conditional-compile-remove(rooms) */
describe('MicrophoneButton tests for different roles', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttonmicoff: <></>,
        chevrondown: <></>,
        controlbuttonmicon: <></>
      }
    });
  });
  test('MicrophoneButton should have been enabled for Presenter role', async () => {
    const wrapper = mountWithPermissions(<MicrophoneButton showLabel={true} />, _getPermissions('Presenter'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBeUndefined();
  });

  test('MicrophoneButton should have been enabled for Attendee role', async () => {
    const wrapper = mountWithPermissions(<MicrophoneButton showLabel={true} />, _getPermissions('Attendee'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBeUndefined();
  });

  test('MicrophoneButton should have been disabled for Consumer role', async () => {
    const wrapper = mountWithPermissions(<MicrophoneButton showLabel={true} />, _getPermissions('Consumer'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBe(true);
  });
});
