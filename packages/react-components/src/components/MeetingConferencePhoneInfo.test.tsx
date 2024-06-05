// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import { formatPhoneNumber, formatPhoneNumberInfo, formatMeetingId } from './MeetingConferencePhoneInfo';

import { assert } from 'console';

describe('Empty test for stable compilation', () => {
  test('USA and Canada format', async () => {
    assert(true);
  });
});

/* @conditional-compile-remove(teams-meeting-conference) */
describe('Display phone number in user friendly format', () => {
  test('Empty string should not break code', async () => {
    assert(formatPhoneNumber('') === '');
    assert(formatPhoneNumber(' ') === ' ');
  });
  test('USA and Canada format', async () => {
    assert(formatPhoneNumber('13121231234') === '+1 (312) 123-1234');
    assert(formatPhoneNumber('+13121231234') === '+1 (312) 123-1234');
  });
});

/* @conditional-compile-remove(teams-meeting-conference) */
describe('Format phone number info based on available data', () => {
  const strings = {
    meetingConferencePhoneInfoModalTollFree: '{phoneNumber} (Toll Free) {country} {city}',
    meetingConferencePhoneInfoModalToll: '{phoneNumber} (Toll) {country} {city}',
    meetingConferencePhoneInfoModalTollFreeWithoutGeoData: '{phoneNumber} (Toll Free)',
    meetingConferencePhoneInfoModalTollWithoutGeoData: '{phoneNumber} (Toll)'
  };

  test('Test toll free and toll label', async () => {
    assert(
      formatPhoneNumberInfo({ phoneNumber: '123', isTollFree: false, conferenceId: '123' }, strings) === '123 (Toll)'
    );
    assert(
      formatPhoneNumberInfo({ phoneNumber: '123', isTollFree: true, conferenceId: '123' }, strings) ===
        '123 (Toll Free)'
    );
  });

  test('Test USA format', async () => {
    assert(
      formatPhoneNumberInfo({ phoneNumber: '12345678900', isTollFree: false, conferenceId: '123' }, strings) ===
        '+1 (234) 567-8900 (Toll)'
    );
  });

  test('Test USA format', async () => {
    assert(
      formatPhoneNumberInfo({ phoneNumber: '12345678900', isTollFree: false, conferenceId: '123' }, strings) ===
        '+1 (234) 567-8900 (Toll)'
    );
  });

  test('Test non USA format', async () => {
    assert(
      formatPhoneNumberInfo({ phoneNumber: '442890123490', isTollFree: false, conferenceId: '123' }, strings) ===
        '+44 (289) 012-3490 (Toll)'
    );
  });

  test('Test with available country info', async () => {
    assert(
      formatPhoneNumberInfo(
        { phoneNumber: '12345678900', isTollFree: false, conferenceId: '123', country: 'Canada' },
        strings
      ) === '+1 (234) 567-8900 (Toll) Canada'
    );
  });

  test('Test with available country and city info', async () => {
    assert(
      formatPhoneNumberInfo(
        { phoneNumber: '12345678900', isTollFree: false, conferenceId: '123', country: 'Canada', city: 'Toronto' },
        strings
      ) === '+1 (234) 567-8900 (Toll) Canada Toronto'
    );
  });
});

/* @conditional-compile-remove(teams-meeting-conference) */
describe('Format conference id', () => {
  test('Test empty value', async () => {
    assert(formatMeetingId('') === '');
  });
  test('Test not expected length', async () => {
    assert(formatMeetingId('123') === '123');
  });

  test('Test expected value', async () => {
    assert(formatMeetingId('123456789') === '123 456 789#');
  });
});
