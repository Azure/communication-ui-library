// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ScreenShareButton } from './ScreenShareButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('ScreenShareButton should work with localization', () => {
  test('Should localize button label ', async () => {
    const screenShareButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const testLocale = createTestLocale({ screenShareButton: screenShareButtonStrings });
    const component = mountWithLocalization(
      <ScreenShareButton strings={screenShareButtonStrings} showLabel={true} />,
      testLocale
    );
    expect(component.text()).toBe(screenShareButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(screenShareButtonStrings.onLabel);
  });
});
