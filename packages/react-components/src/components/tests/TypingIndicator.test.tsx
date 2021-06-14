// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TypingIndicator } from '../TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization } from './enzymeUtils';
import { act } from 'react-dom/test-utils';
import englishStrings from '../../localization/translated/en-US.json';

Enzyme.configure({ adapter: new Adapter() });

test('TypingIndicator test in english', async () => {
  const component = mountWithLocalization(
    <TypingIndicator typingUsers={[{ userId: 'user2', displayName: 'Claire' }]} />,
    englishStrings
  );
  await act(async () => component);
  component.update();
  expect(component.html()).toBe(
    '<div class="ms-Stack css-56"><div class="ms-Stack css-57"><span><div class="ms-Stack css-58">Claire</div></span><span> is typing ...</span></div></div>'
  );
});
