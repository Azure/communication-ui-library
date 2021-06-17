// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization } from './utils/enzymeUtils';
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });

describe('TypingIndicator should format string correctly', () => {
  test('One user case', async () => {
    const randomText = Math.random().toString();
    const strings = {
      typing_indicator_singular: '{users} ' + randomText
    };
    const component = mountWithLocalization(
      <TypingIndicator typingUsers={[{ userId: 'user2', displayName: 'Claire' }]} />,
      { strings }
    );
    await act(async () => component);
    component.update();
    expect(component.text()).toBe('Claire ' + randomText);
  });
});
