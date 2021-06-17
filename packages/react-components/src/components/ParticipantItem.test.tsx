// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantItem } from './ParticipantItem';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization } from './utils/enzymeUtils';
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });

describe('TypingIndicator should format string correctly', () => {
  test('ParticipantItem snapshot in en-US', async () => {
    const strings = {
      participant_item_me_text: Math.random().toString()
    };
    const component = mountWithLocalization(<ParticipantItem displayName="Mark" me={true} />, {
      locale: Math.random().toString(),
      strings: strings,
      rtl: false
    });
    await act(async () => component);
    component.update();
    expect(component.text()).toContain(strings.participant_item_me_text);
  });
});
