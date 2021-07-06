// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('TypingIndicator should format string correctly', () => {
  test('One user case', async () => {
    const randomText = Math.random().toString();
    const testLocale = createTestLocale({ typingIndicator: { singleUser: '{user} ' + randomText } });
    const component = mountWithLocalization(
      <TypingIndicator typingUsers={[{ userId: 'user2', displayName: 'Claire' }]} />,
      testLocale
    );
    component.update();
    expect(component.text()).toBe('Claire ' + randomText);
  });
});
