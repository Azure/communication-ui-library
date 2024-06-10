// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { convertConferencePhoneInfo } from './Converter';

describe('Verify convert of TeamsMeetingAudioConferencingDetails to ConferencePhoneInfo', () => {
  test('undefined details has to be converted to empty list', async () => {
    const phoneInfo = convertConferencePhoneInfo(undefined);
    expect(phoneInfo).toStrictEqual([]);
  });

  test('empty phone list has to be converted to empty list', async () => {
    const phoneInfo = convertConferencePhoneInfo({ phoneConferenceId: '123', phoneNumbers: [] });
    expect(phoneInfo).toStrictEqual([]);
  });

  test('Phone number without country code and city has to contains just number and conferenceId', async () => {
    const phoneInfo = convertConferencePhoneInfo({
      phoneConferenceId: '123',
      phoneNumbers: [
        {
          tollPhoneNumber: {
            phoneNumber: '1234567890'
          }
        }
      ]
    });
    expect(phoneInfo.length).toBe(1);
    expect(phoneInfo[0].phoneNumber).toBe('1234567890');
    expect(phoneInfo[0].conferenceId).toBe('123');
    expect(phoneInfo[0].isTollFree).toBe(false);
  });

  test('Phone number with country code and city has to contains all fields', async () => {
    const phoneInfo = convertConferencePhoneInfo({
      phoneConferenceId: '123',
      phoneNumbers: [
        {
          tollPhoneNumber: {
            phoneNumber: '1234567890'
          },
          countryName: 'US',
          cityName: 'Redmond'
        }
      ]
    });
    expect(phoneInfo.length).toBe(1);
    expect(phoneInfo[0].phoneNumber).toBe('1234567890');
    expect(phoneInfo[0].conferenceId).toBe('123');
    expect(phoneInfo[0].isTollFree).toBe(false);
    expect(phoneInfo[0].country).toBe('US');
    expect(phoneInfo[0].city).toBe('Redmond');
  });

  test('Toll free phone number has to be marked as toll free', async () => {
    const phoneInfo = convertConferencePhoneInfo({
      phoneConferenceId: '123',
      phoneNumbers: [
        {
          tollFreePhoneNumber: {
            phoneNumber: '1234567890'
          }
        }
      ]
    });
    expect(phoneInfo.length).toBe(1);
    expect(phoneInfo[0].isTollFree).toBe(true);
  });

  test('Toll free phone number info with multiple numbers', async () => {
    const phoneInfo = convertConferencePhoneInfo({
      phoneConferenceId: '123',
      phoneNumbers: [
        {
          tollFreePhoneNumber: {
            phoneNumber: '1234567890'
          }
        },
        {
          tollFreePhoneNumber: {
            phoneNumber: '0987654321'
          }
        }
      ]
    });
    expect(phoneInfo.length).toBe(2);
    expect(phoneInfo[0].isTollFree).toBe(true);
    expect(phoneInfo[0].phoneNumber).toBe('1234567890');
    expect(phoneInfo[1].isTollFree).toBe(true);
    expect(phoneInfo[1].phoneNumber).toBe('0987654321');
  });

  test('Details with two phone numbers has to export both', async () => {
    const phoneInfo = convertConferencePhoneInfo({
      phoneConferenceId: '123',
      phoneNumbers: [
        {
          tollPhoneNumber: {
            phoneNumber: '0987654321'
          },
          tollFreePhoneNumber: {
            phoneNumber: '1234567890'
          }
        }
      ]
    });
    expect(phoneInfo.length).toBe(2);
    expect(phoneInfo[0].isTollFree).toBe(false);
    expect(phoneInfo[0].phoneNumber).toBe('0987654321');
    expect(phoneInfo[1].isTollFree).toBe(true);
    expect(phoneInfo[1].phoneNumber).toBe('1234567890');
  });
});
