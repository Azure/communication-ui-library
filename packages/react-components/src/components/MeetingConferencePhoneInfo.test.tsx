// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import { formatPhoneNumber, formatPhoneNumberInfo } from './MeetingConferencePhoneInfo';
/* @conditional-compile-remove(teams-meeting-conference) */
import { assert } from 'console';

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
    meetingConferencePhoneInfoModalTollFree: '(Toll Free)',
    meetingConferencePhoneInfoModalToll: '(Toll)'
  };

  test('No phone info should break app', async () => {
    assert(formatPhoneNumberInfo(undefined, strings) === '');
    assert(
      formatPhoneNumberInfo({ phoneNumber: '123', isTollFree: false, conferenceId: '123' }, strings) === '123 (Toll)'
    );
  });

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
      ) === '+1 (234) 567-8900 (Toll) Canada, Toronto'
    );
  });
});
