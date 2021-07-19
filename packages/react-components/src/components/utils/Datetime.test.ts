// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { formatDateForChatMessage, formatTimeForChatMessage, formatTimestampForChatMessage } from './Datetime';
import defaultStrings from '../../localization/translated/en_US.json';

const createMockDate = (datetime: {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  min?: number;
  sec?: number;
  milli?: number;
}): Date =>
  new Date(
    datetime.year ?? 2000,
    datetime.month ?? 0,
    datetime.day ?? 1,
    datetime.hour ?? 0,
    datetime.min ?? 0,
    datetime.sec ?? 0,
    datetime.milli ?? 0
  );

describe('datetime tests', () => {
  test('datetime.formatTimeForChatMessage should formatTime for am properly', () => {
    expect(formatTimeForChatMessage(createMockDate({ hour: 11, min: 11 }))).toEqual('11:11 a.m.');
  });

  test('datetime.formatTimeForChatMessage should formatTime for pm properly', () => {
    expect(formatTimeForChatMessage(createMockDate({ hour: 20, min: 20 }))).toEqual('8:20 p.m.');
  });

  test('datetime.formatTimeForChatMessage should account for single digit minutes', () => {
    expect(formatTimeForChatMessage(createMockDate({ hour: 20, min: 1 }))).toEqual('8:01 p.m.');
  });

  test('datetime.formatTimeForChatMessage should work for single digit hours', () => {
    expect(formatTimeForChatMessage(createMockDate({ hour: 2, min: 1 }))).toEqual('2:01 a.m.');
  });

  test('datetime.formatDateForChatMessage should format date properly with month starting at 0', () => {
    expect(formatDateForChatMessage(createMockDate({ year: 2000, month: 0, day: 30, hour: 0, min: 0 }))).toEqual(
      '2000-01-30'
    );
  });

  test('datetime.formatDateForChatMessage should format date properly with single digit day', () => {
    expect(formatDateForChatMessage(createMockDate({ year: 2000, month: 0, day: 1, hour: 0, min: 0 }))).toEqual(
      '2000-01-01'
    );
  });

  test('datetime.formatDateForChatMessage should format date properly with multiple digit month', () => {
    expect(formatDateForChatMessage(createMockDate({ year: 2000, month: 10, day: 1, hour: 0, min: 0 }))).toEqual(
      '2000-11-01'
    );
  });

  test('datetime.formatTimestampForChatMessage should format date from same day properly', () => {
    expect(
      formatTimestampForChatMessage(
        createMockDate({ year: 2000, month: 10, day: 1, hour: 4, min: 0 }),
        createMockDate({ year: 2000, month: 10, day: 1, hour: 5, min: 0 }),
        defaultStrings.messageThread
      )
    ).toEqual('4:00 a.m.');
  });

  test('datetime.formatTimestampForChatMessage should format date from yesterday properly', () => {
    expect(
      formatTimestampForChatMessage(
        createMockDate({ year: 2000, month: 10, day: 9, hour: 4, min: 0 }),
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        defaultStrings.messageThread
      )
    ).toEqual('Yesterday 4:00 a.m.');
  });

  test('datetime.formatTimestampForChatMessage should format date from same week properly', () => {
    expect(
      formatTimestampForChatMessage(
        createMockDate({ year: 2000, month: 10, day: 8, hour: 4, min: 0 }),
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        defaultStrings.messageThread
      )
    ).toEqual('Wednesday 4:00 a.m.');
  });

  test('datetime.formatTimestampForChatMessage should format date from long time ago properly', () => {
    expect(
      formatTimestampForChatMessage(
        createMockDate({ year: 1999, month: 10, day: 8, hour: 4, min: 0 }),
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        defaultStrings.messageThread
      )
    ).toEqual('1999-11-08 4:00 a.m.');
  });
});
