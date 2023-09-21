// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getReadableTime } from './HoldPane';

describe('Hold Pane tests', () => {
  test('getReadableTime should report the correct time in minutes to be 30 minutes', () => {
    const timeInMiliSeconds = 1800000;
    const time = getReadableTime(timeInMiliSeconds);

    expect(time).toBe('30:00');
  });

  test('getReadableTime should report the correct time to be 1 hour', () => {
    const timeInMiliSeconds = 3600000;
    const time = getReadableTime(timeInMiliSeconds);

    expect(time).toBe('1:00:00');
  });

  test('getReadableTime should report the correct time to be 1 hour 30 minutes', () => {
    const timeInMiliSeconds = 5400000;
    const time = getReadableTime(timeInMiliSeconds);

    expect(time).toBe('1:30:00');
  });
});
