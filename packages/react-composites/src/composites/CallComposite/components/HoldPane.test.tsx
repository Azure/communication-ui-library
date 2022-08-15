// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getReadableTime } from './HoldPane';

describe('Hold Pane tests', () => {
  test('getReadableTime should report the correct time in minutes to be 30 minutes', () => {
    const timeInMiliSeconds = 18000000;
    const time = getReadableTime(timeInMiliSeconds);

    expect(time).toBe('30:00');
  });

  test.only('getReadableTime should report the correct time to be 1 hour', () => {
    const timeInMiliSeconds = 36000000;
    const time = getReadableTime(timeInMiliSeconds);
    console.log(time);

    expect(time).toBe('1:00:00');
  });

  test('getReadableTime should report the correct time to be 1 hour 30 minutes', () => {
    const timeInMiliSeconds = 5400000;
    const time = getReadableTime(timeInMiliSeconds);

    expect(time).toBe('1:30:00');
  });
});
