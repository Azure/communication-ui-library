// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { SendBox } from './SendBox';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
import { TextField } from '@fluentui/react';

Enzyme.configure({ adapter: new Adapter() });

describe('SendBox strings should be localizable and overridable', () => {
  test('Should localize placeholder text', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    const component = mountWithLocalization(<SendBox />, testLocale);
    expect(component.find(TextField).props().placeholder).toBe(testLocale.strings.sendBox.placeholderText);
  });
  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    const sendBoxStrings = { placeholderText: Math.random().toString() };
    const component = mountWithLocalization(<SendBox strings={sendBoxStrings} />, testLocale);
    expect(component.find(TextField).props().placeholder).toBe(sendBoxStrings.placeholderText);
  });
});
