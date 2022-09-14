// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ScreenShareButton } from './ScreenShareButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('ScreenShareButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttonscreensharestart: <></>,
        controlbuttonscreensharestop: <></>
      }
    });
  });
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
