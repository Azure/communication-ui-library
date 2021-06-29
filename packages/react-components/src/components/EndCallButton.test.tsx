// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { EndCallButton } from './EndCallButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('EndCallButton should work with localization', () => {
  test('Should localize button label', async () => {
    const endCallButtonStrings = { label: Math.random().toString() };
    const testLocale = createTestLocale({ endCallButton: endCallButtonStrings });
    const component = mountWithLocalization(
      <EndCallButton strings={endCallButtonStrings} showLabel={true} />,
      testLocale
    );
    expect(component.text()).toBe(endCallButtonStrings.label);
  });
});
