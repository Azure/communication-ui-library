// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButton } from './CameraButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('CameraButton strings should be localizable and overridable', () => {
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
