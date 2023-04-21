// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react';
import { Dialpad, DialpadStrings, DtmfTone } from './Dialpad';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { createTestLocale, renderWithLocalization } from '../utils/testUtils';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

const mockSendDTMF = jest.fn();

const onSendDtmfTone = (dtmfTone: DtmfTone): Promise<void> => {
  mockSendDTMF(dtmfTone);
  return Promise.resolve();
};

describe('Dialpad tests', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        dialpadbackspace: <></>
      }
    });
  });
  beforeEach(() => {
    mockSendDTMF.mockClear();
  });
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
    renderWithLocalization(<Dialpad />, testLocale);
    expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(testLocale.strings.dialpad.placeholderText);
  });

  test('Clicking on dialpad button 1 should show 1 in input box', async () => {
    render(<Dialpad />);
    const button = screen.getByRole('button', { name: '1' });

    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('1');
  });

  test('Clicking on dialpad button 6 should send the corresponding dtmf tone Num6', async () => {
    render(<Dialpad onSendDtmfTone={onSendDtmfTone} />);
    const button = screen.getByRole('button', { name: '6MNO' });
    fireEvent.click(button);
    expect(mockSendDTMF).toHaveBeenCalledWith('Num6');
  });

  test('Clicking on dialpad button 9 should not send other dtmf tones', async () => {
    render(<Dialpad onSendDtmfTone={onSendDtmfTone} />);
    const button = screen.getByRole('button', { name: '9WXYZ' });
    fireEvent.click(button);

    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num6');
    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num1');
    expect(mockSendDTMF).not.toHaveBeenCalledWith('Num5');
  });

  test('Dialpad should have customizable default input text', async () => {
    const customDialpadStrings: DialpadStrings = {
      placeholderText: Math.random().toString(),
      deleteButtonAriaLabel: Math.random().toString()
    };
    render(<Dialpad strings={customDialpadStrings} />);
    expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(customDialpadStrings.placeholderText);
  });

  test('Dialpad input box should be editable by keyboard', async () => {
    render(<Dialpad />);
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('1');
  });

  test('Dialpad input box should filter out non-valid input', async () => {
    render(<Dialpad />);
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.change(input, { target: { value: 'ABC1' } });
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('1');
  });

  test('Typing in 12345678900 should show 1 (234) 567-8900 in input box', async () => {
    render(<Dialpad />);
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.change(input, { target: { value: '12345678900' } });
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('1 (234) 567-8900');
  });

  test('Typing in 2345678900 should show (234) 567-8900 in input box', async () => {
    render(<Dialpad />);
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.change(input, { target: { value: '2345678900' } });
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('(234) 567-8900');
  });

  test('Typing in 23456789000 should show  23456789000 in input box', async () => {
    render(<Dialpad />);
    const input = screen.getByRole('textbox');

    act(() => {
      fireEvent.change(input, { target: { value: '23456789000' } });
    });

    expect(screen.getByRole('textbox').getAttribute('value')).toBe('23456789000');
  });
});

export default {};
