// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { _Dialpad } from './Dialpad';

Enzyme.configure({ adapter: new Adapter() });

const dialpadStrings = {
  defaultText: Math.random().toString()
};

describe('Dialpad tests', () => {
  test('Clicking on dialpad button 1 should show 1 in input box', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    const button = component.find('#dialpad-button-0').first();
    if (button) {
      button.simulate('click');
    }

    expect(component.find('#dialpad-input').first().props().value).toBe('1');
  });

  test('Dialpad should have default input text', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    expect(component.find('#dialpad-input').first().props().placeholder).toBe(dialpadStrings.defaultText);
  });

  test('Dialpad input box should be editable by keyboard', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Dialpad input box should filter out non-valid input', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: 'ABC1' } });
    expect(component.find('input').first().props().value).toBe('1');
  });

  test('Typing in 12345678900 should show 1 (234) 567-8900 in input box', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '12345678900' } });
    expect(component.find('input').first().props().value).toBe('1 (234) 567-8900');
  });

  test('Typing in 2345678900 should show (234) 567-8900 in input box', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '2345678900' } });
    expect(component.find('input').first().props().value).toBe('(234) 567-8900');
  });

  test('Typing in 23456789000 should show  23456789000 in input box', async () => {
    const component = mount(<_Dialpad strings={dialpadStrings} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '23456789000' } });
    expect(component.find('input').first().props().value).toBe('23456789000');
  });
});
