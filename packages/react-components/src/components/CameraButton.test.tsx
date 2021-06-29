// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButton } from './CameraButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('CameraButton should work with localization', () => {
  test('Should localize button label ', async () => {
    const cameraButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const testLocale = createTestLocale({ cameraButton: cameraButtonStrings });
    const component = mountWithLocalization(
      <CameraButton strings={cameraButtonStrings} showLabel={true} />,
      testLocale
    );
    expect(component.text()).toBe(cameraButtonStrings.offLabel);
    component.setProps({ checked: true });
    expect(component.text()).toBe(cameraButtonStrings.onLabel);
  });
});
