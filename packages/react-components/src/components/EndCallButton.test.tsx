// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { EndCallButton } from './EndCallButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('EndCallButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    const component = mountWithLocalization(<EndCallButton showLabel={true} />, testLocale);
    expect(component.find('button').text()).toBe(testLocale.strings.endCallButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    const endCallButtonStrings = { label: Math.random().toString() };
    const component = mountWithLocalization(
      <EndCallButton showLabel={true} strings={endCallButtonStrings} />,
      testLocale
    );
    expect(component.find('button').text()).toBe(endCallButtonStrings.label);
  });
});
