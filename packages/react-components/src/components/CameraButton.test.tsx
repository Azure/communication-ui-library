// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButton } from './CameraButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization, mountWithPermissions } from './utils/testUtils';
import { _getPermissions } from '../permissions';
import { ControlBarButton } from './ControlBarButton';
import { registerIcons } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('CameraButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttoncameraoff: <></>,
        chevrondown: <></>,
        controlbuttoncameraon: <></>
      }
    });
  });
  test('Should localize button label ', async () => {
    const testLocale = createTestLocale({
      cameraButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const component = mountWithLocalization(<CameraButton showLabel={true} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.cameraButton.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(testLocale.strings.cameraButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      cameraButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const cameraButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const component = mountWithLocalization(
      <CameraButton showLabel={true} strings={cameraButtonStrings} />,
      testLocale
    );
    expect(component.text()).toBe(cameraButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(cameraButtonStrings.onLabel);
  });
});

describe('Camera button tests for different roles', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttoncameraoff: <></>,
        chevrondown: <></>,
        controlbuttoncameraon: <></>
      }
    });
  });
  test('Camera button should have been enabled for Presenter role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, _getPermissions('Presenter'));
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(false);
  });

  test('Camera button should have been enabled for Attendee role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, _getPermissions('Attendee'));
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(false);
  });

  test('Camera button should have been disabled for Consumer role', async () => {
    const wrapper = mountWithPermissions(<CameraButton showLabel={true} />, _getPermissions('Consumer'));
    const cameraButton = wrapper.find(ControlBarButton).first();
    expect(cameraButton.prop('disabled')).toBe(true);
  });
});
