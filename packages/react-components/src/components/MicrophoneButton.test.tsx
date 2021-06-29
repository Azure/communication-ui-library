// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('MicrophoneButton should work with localization', () => {
  test('Should localize button label ', async () => {
    const microphoneButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const testLocale = createTestLocale({ microphoneButton: microphoneButtonStrings });
    const component = mountWithLocalization(
      <MicrophoneButton strings={microphoneButtonStrings} showLabel={true} />,
      testLocale
    );
    expect(component.text()).toBe(microphoneButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(microphoneButtonStrings.onLabel);
  });
});
