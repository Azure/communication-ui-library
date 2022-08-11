// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Dialpad, DtmfTone, DialpadStrings } from './Dialpad';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { createTestLocale, mountWithLocalization } from '../utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

const mockSendDTMF = jest.fn();

const onSendDtmfTone = (dtmfTone: DtmfTone): Promise<void> => {
  mockSendDTMF(dtmfTone);
  return Promise.resolve();
};

describe('Dialpad tests', () => {
  /*
   * Localization depends on public API for `LocalizationProvider` that does not
   * have the strings for the beta-only `Dialpad` component.
   * skip this test for stable build.
   *
   * @conditional-compile-remove(dialpad)
   */
  test('Should localize default text ', async () => {
    const dialpadStrings: DialpadStrings = {
      placeholderText: Math.random().toString(),
      deleteButtonAriaLabel: Math.random().toString()
    };
    const testLocale = createTestLocale({
      dialpad: dialpadStrings
    });
    const component = mountWithLocalization(<Dialpad />, testLocale);
    expect(component.find('[data-test-id="dialpad-input"]').first().props().placeholder).toBe(
      testLocale.strings.dialpad.placeholderText
    );
  });

  test('Clicking on dialpad button 1 should show 1 in input box', async () => {
    const component = mount(<Dialpad />);
    const button = component.find('[data-test-id="dialpad-button-0"]').first();
    if (button) {
      button.simulate('click');
    }

    expect(component.find('[data-test-id="dialpad-input"]').first().props().value).toBe('1');
  });

  test('Clicking on dialpad button 6 should send the corresponding dtmf tone Num6', async () => {
    const component = mount(<Dialpad onSendDtmfTone={onSendDtmfTone} />);

    const button = component.find('[data-test-id="dialpad-button-5"]').first();
    if (button) {
      button.simulate('click');
    }
    expect(mockSendDTMF).toHaveBeenCalledWith('Num6');
  });

  test('Clicking on dialpad button 9 should not send other dtmf tones', async () => {
    const component = mount(<Dialpad onSendDtmfTone={onSendDtmfTone} />);

    const button = component.find('[data-test-id="dialpad-button-8"]').first();
    if (button) {
      button.simulate('click');
    }
    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num6');
    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num1');
    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num5');
  });

  test('Dialpad should have customizable default input text', async () => {
    const customDialpadStrings: DialpadStrings = {
      placeholderText: Math.random().toString(),
      deleteButtonAriaLabel: Math.random().toString()
    };
    const component = mount(<Dialpad strings={customDialpadStrings} />);
    expect(component.find('[data-test-id="dialpad-input"]').first().props().placeholder).toBe(
      customDialpadStrings.placeholderText
    );
  });

  test('Dialpad input box should be editable by keyboard', async () => {
    const component = mount(<Dialpad />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Dialpad input box should filter out non-valid input', async () => {
    const component = mount(<Dialpad />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: 'ABC1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Typing in 12345678900 should show 1 (234) 567-8900 in input box', async () => {
    const component = mount(<Dialpad />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '12345678900' } });
    expect(component.find('input').first().props().value).toBe('1 (234) 567-8900');
  });

  test('Typing in 2345678900 should show (234) 567-8900 in input box', async () => {
    const component = mount(<Dialpad />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '2345678900' } });
    expect(component.find('input').first().props().value).toBe('(234) 567-8900');
  });

  test('Typing in 23456789000 should show  23456789000 in input box', async () => {
    const component = mount(<Dialpad />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '23456789000' } });
    expect(component.find('input').first().props().value).toBe('23456789000');
  });
});

export default {};
