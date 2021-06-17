// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TypingIndicator } from '../TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization } from './enzymeUtils';
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });

test('TypingIndicator test in english', async () => {
  const randomText = Math.random().toString();
  const strings = {
    typing_indicator_singular: '{users} ' + randomText
  };
  const component = mountWithLocalization(
    <TypingIndicator typingUsers={[{ userId: 'user2', displayName: 'Claire' }]} />,
    {
      locale: Math.random().toString(),
      strings: strings,
      rtl: false
    }
  );
  await act(async () => component);
  component.update();
  expect(component.text()).toBe('Claire ' + randomText);
});
