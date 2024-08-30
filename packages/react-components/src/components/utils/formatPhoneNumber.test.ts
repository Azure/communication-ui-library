// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _formatPhoneNumber } from './formatPhoneNumber';

describe('Dialpad numbers should be formatted based on NA phone format by formatPhoneNumber function', () => {
  test('when phone number start with 1, format the number with area code 1 (xxx) xxx-xxxx', () => {
    const number = '16767876733';
    const result = '1 (676) 787-6733';
    expect(_formatPhoneNumber(number)).toEqual(result);
  });

  test('when phone number start with +, format the number with area code +x (xxx) xxx-xxxx', () => {
    const number = '+16767876733';
    const result = '+1 (676) 787-6733';
    expect(_formatPhoneNumber(number)).toEqual(result);
  });

  test('when phone number start with anything else, format the number without area code (xxx) xxx-xxxx', () => {
    const number = '6767876733';
    const result = '(676) 787-6733';
    expect(_formatPhoneNumber(number)).toEqual(result);
  });

  test('North America phone number is enchanted', () => {
    const number = '12345678900';
    const result = '+1 (234) 567-8900';
    expect(_formatPhoneNumber(number, true)).toEqual(result);
  });
});
