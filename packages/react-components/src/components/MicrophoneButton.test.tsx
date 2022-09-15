// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';
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
