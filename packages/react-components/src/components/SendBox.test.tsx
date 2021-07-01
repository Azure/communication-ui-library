// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { SendBox } from './SendBox';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
import { TextField } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('SendBox should work with localization', () => {
  test('Should localize placeholder text', async () => {
    const sendBoxStrings = { placeholderText: Math.random().toString() };
    const testLocale = createTestLocale({ sendBox: sendBoxStrings });
    const component = mountWithLocalization(<SendBox />, testLocale);
    expect(component.find(TextField).props().placeholder).toBe(sendBoxStrings.placeholderText);
  });
});
