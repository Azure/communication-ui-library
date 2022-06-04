// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(dialpad) */
import React from 'react';
/* @conditional-compile-remove(dialpad) */
import Enzyme, { mount } from 'enzyme';
/* @conditional-compile-remove(dialpad) */
import Adapter from 'enzyme-adapter-react-16';
/* @conditional-compile-remove(dialpad) */
import { _Dialpad } from './Dialpad';
/* @conditional-compile-remove(dialpad) */
import { createTestLocale, mountWithLocalization } from '../utils/testUtils';
/* @conditional-compile-remove(dialpad) */
Enzyme.configure({ adapter: new Adapter() });

/* @conditional-compile-remove(dialpad) */
const customDialpadStrings = {
  defaultText: Math.random().toString()
};

test('workaround for conditional compilation. Test suite must contain atleast one test', () => {
  expect(true).toBeTruthy();
});

/* @conditional-compile-remove(dialpad) */
describe('Dialpad tests', () => {
  test('Should localize default text ', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    expect(component.find('#dialpad-input').first().props().placeholder).toBe(testLocale.strings.dialpad.defaultText);
  });

  test('Clicking on dialpad button 1 should show 1 in input box', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    const button = component.find('#dialpad-button-0').first();
    if (button) {
      button.simulate('click');
    }

    expect(component.find('#dialpad-input').first().props().value).toBe('1');
  });

  test('Dialpad should have customizable default input text', async () => {
    const component = mount(<_Dialpad strings={customDialpadStrings} />);
    expect(component.find('#dialpad-input').first().props().placeholder).toBe(customDialpadStrings.defaultText);
  });

  test('Dialpad input box should be editable by keyboard', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Dialpad input box should filter out non-valid input', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: 'ABC1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Typing in 12345678900 should show 1 (234) 567-8900 in input box', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '12345678900' } });
    expect(component.find('input').first().props().value).toBe('1 (234) 567-8900');
  });

  test('Typing in 2345678900 should show (234) 567-8900 in input box', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '2345678900' } });
    expect(component.find('input').first().props().value).toBe('(234) 567-8900');
  });

  test('Typing in 23456789000 should show  23456789000 in input box', async () => {
    const testLocale = createTestLocale({
      dialpad: { defaultText: Math.random().toString() }
    });
    const component = mountWithLocalization(<_Dialpad />, testLocale);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '23456789000' } });
    expect(component.find('input').first().props().value).toBe('23456789000');
  });
});

export default {};
