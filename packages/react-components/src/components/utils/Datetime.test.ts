// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { formatDateForChatMessage, formatTimeForChatMessage, formatTimestampForChatMessage } from './Datetime';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';

const createMockDate = (dateTime: {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  min?: number;
  sec?: number;
}): Date =>
  new Date(
    dateTime.year ?? 2000,
    dateTime.month ?? 0,
    dateTime.day ?? 1,
    dateTime.hour ?? 0,
    dateTime.min ?? 0,
    dateTime.sec ?? 0
  );

describe('datetime tests', () => {
  test('datetime.formatTimeForChatMessage should formatTime with seconds properly', () => {
    const messageDate = createMockDate({ hour: 11, min: 11, sec: 11 });
    expect(formatTimeForChatMessage(messageDate)).toEqual(
      messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    );
  });

  test('datetime.formatTimeForChatMessage should formatTime properly', () => {
    const messageDate = createMockDate({ hour: 20, min: 20 });
    expect(formatTimeForChatMessage(messageDate)).toEqual(
      messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    );
  });

  test('datetime.formatTimeForChatMessage should account for single digit minutes', () => {
    const messageDate = createMockDate({ hour: 20, min: 1 });
    expect(formatTimeForChatMessage(messageDate)).toEqual(
      messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    );
  });

  test('datetime.formatTimeForChatMessage should work for single digit hours', () => {
    const messageDate = createMockDate({ hour: 2, min: 1 });
    expect(formatTimeForChatMessage(messageDate)).toEqual(
      messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    );
  });

  test('datetime.formatDateForChatMessage should format date properly with month starting at 0', () => {
    const date = createMockDate({ year: 2000, month: 0, day: 30, hour: 0, min: 0 });
    expect(formatDateForChatMessage(date)).toEqual(date.toLocaleDateString());
  });

  test('datetime.formatDateForChatMessage should format date properly with single digit day', () => {
    const date = createMockDate({ year: 2000, month: 0, day: 1, hour: 0, min: 0 });
    expect(formatDateForChatMessage(date)).toEqual(date.toLocaleDateString());
  });

  test('datetime.formatDateForChatMessage should format date properly with multiple digit month', () => {
    const date = createMockDate({ year: 2000, month: 10, day: 1, hour: 0, min: 0 });
    expect(formatDateForChatMessage(date)).toEqual(date.toLocaleDateString());
  });

  test('datetime.formatTimestampForChatMessage should format date from same day properly', () => {
    const messageDate = createMockDate({ year: 2000, month: 10, day: 1, hour: 4, min: 0 });
    expect(
      formatTimestampForChatMessage(
        messageDate,
        createMockDate({ year: 2000, month: 10, day: 1, hour: 5, min: 0 }),
        COMPONENT_LOCALE_EN_US.strings.messageThread
      )
    ).toEqual(messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
  });

  test('datetime.formatTimestampForChatMessage should format date from yesterday properly', () => {
    const messageDate = createMockDate({ year: 2000, month: 10, day: 9, hour: 4, min: 0 });
    expect(
      formatTimestampForChatMessage(
        messageDate,
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        COMPONENT_LOCALE_EN_US.strings.messageThread
      )
    ).toEqual(`Yesterday ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`);
  });

  test('datetime.formatTimestampForChatMessage should format date from same week properly', () => {
    const messageDate = createMockDate({ year: 2000, month: 10, day: 8, hour: 4, min: 0 });
    expect(
      formatTimestampForChatMessage(
        messageDate,
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        COMPONENT_LOCALE_EN_US.strings.messageThread
      )
    ).toEqual(`Wednesday ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`);
  });

  test('datetime.formatTimestampForChatMessage should format date from long time ago properly', () => {
    const messageDate = createMockDate({ year: 1999, month: 10, day: 8, hour: 4, min: 0 });
    expect(
      formatTimestampForChatMessage(
        messageDate,
        createMockDate({ year: 2000, month: 10, day: 10, hour: 5, min: 0 }),
        COMPONENT_LOCALE_EN_US.strings.messageThread
      )
    ).toEqual(
      `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    );
  });
});
