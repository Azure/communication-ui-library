// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ScreenShareButton } from './ScreenShareButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization, mountWithPermissions } from './utils/testUtils';
import { _getPermissions } from '../permissions';
import { ControlBarButton } from './ControlBarButton';

Enzyme.configure({ adapter: new Adapter() });

describe('ScreenShareButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      screenShareButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const component = mountWithLocalization(<ScreenShareButton showLabel={true} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.screenShareButton.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(testLocale.strings.screenShareButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      screenShareButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const screenShareButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const component = mountWithLocalization(
      <ScreenShareButton showLabel={true} strings={screenShareButtonStrings} />,
      testLocale
    );
    expect(component.text()).toBe(screenShareButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(screenShareButtonStrings.onLabel);
  });
});

describe('Screenshare button tests for different roles', () => {
  test('Screenshare button should have been enabled for Presenter role', async () => {
    const wrapper = mountWithPermissions(<ScreenShareButton showLabel={true} />, _getPermissions('Presenter'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBeUndefined();
  });

  test('Screenshare button should have been disabled for Attendee role', async () => {
    const wrapper = mountWithPermissions(<ScreenShareButton showLabel={true} />, _getPermissions('Attendee'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBe(true);
  });

  test('Screenshare button should have been enabled for Consumer role', async () => {
    const wrapper = mountWithPermissions(<ScreenShareButton showLabel={true} />, _getPermissions('Consumer'));
    const controlBarButton = wrapper.find(ControlBarButton).first();
    expect(controlBarButton.prop('disabled')).toBe(true);
  });
});
