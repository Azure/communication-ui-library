// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mountWithLocalization } from './enzymeUtils';
import { TypingIndicator } from '../TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('ParticipantItem snapshot in en-US', async () => {
  const wrapper = mountWithLocalization(<TypingIndicator typingUsers={[{ userId: '1', displayName: 'Claire' }]} />);
  expect(wrapper.html()).toEqual(
    '<div class="ms-Stack css-56"><div class="ms-Stack css-57"><div class="ms-Stack css-58">Claire</div> is typing ...</div></div>'
  );
});
