// © Microsoft Corporation. All rights reserved.

import { AudioDeviceInfo } from '@azure/communication-calling';
import { CallingApplication, CommunicationUser, PhoneNumber, UnknownIdentifier } from '@azure/communication-common';
import { getACSId, isGUID, isInCall, isSelectedDeviceInList } from './SDKUtils';

describe('SDKUtils tests', () => {
  describe('getACSId tests', () => {
    afterAll(() => {
      jest.resetAllMocks();
    });

    jest.mock('@azure/communication-calling', () => {
      return {
        isCommunicationUser: (identifer: CommunicationUser | CallingApplication | UnknownIdentifier | PhoneNumber) => {
          return 'communicationUserId' in identifer;
        },
        isCallingApplication: (identifer: CommunicationUser | CallingApplication | UnknownIdentifier | PhoneNumber) => {
          return 'callingApplicationId' in identifer;
        },
        isPhoneNumber: (identifer: CommunicationUser | CallingApplication | UnknownIdentifier | PhoneNumber) => {
          return 'phoneNumber' in identifer;
        }
      };
    });

    test('getACSId should return CommunicationUserId if the identifier is a CommunicationUser', () => {
      // Arrange
      const expectedId = 'testUserId';
      const identifer: CommunicationUser = { communicationUserId: expectedId };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });

    test('getACSId should return CallingApplicationId if the identifier is a CallingApplication', () => {
      // Arrange
      const expectedId = 'testCallApplicationId';
      const identifer: CallingApplication = { callingApplicationId: expectedId };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });

    test('getACSId should return PhoneNumber if the identifier is a PhoneNumber', () => {
      // Arrange
      const expectedId = 'testPhoneNumber';
      const identifer: PhoneNumber = { phoneNumber: expectedId };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });

    test('getACSId should return id if the identifier is a something other than CommunicationUser, CallingApplication or PhoneNumber', () => {
      // Arrange
      const expectedId = 'testId';
      const identifer: UnknownIdentifier = { id: expectedId };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });
  });

  describe('isSelectedDeviceInList tests', () => {
    const createMockAudioDevice = (name: string): AudioDeviceInfo => {
      /*@ts-ignore*/
      return { name };
    };

    test('isSelectedDeviceInList should return true if device is in list', () => {
      // Arrange
      const item = createMockAudioDevice('item1');
      const deviceList = [createMockAudioDevice('item1'), createMockAudioDevice('item2')];

      // Act
      const deviceFound = isSelectedDeviceInList(item, deviceList);

      // Assert
      expect(deviceFound).toEqual(true);
    });

    test('isSelectedDeviceInList should return false if device is not in the list', () => {
      // Arrange
      const item = createMockAudioDevice('item0');
      const deviceList = [createMockAudioDevice('item1'), createMockAudioDevice('item2')];

      // Act
      const deviceFound = isSelectedDeviceInList(item, deviceList);

      // Assert
      expect(deviceFound).toEqual(false);
    });
  });

  test('isInCall should return true if state is anything other than none or disconnected', () => {
    // false conditions
    expect(isInCall('None')).toEqual(false);
    expect(isInCall('Disconnected')).toEqual(false);

    // true conditions
    expect(isInCall('Incoming')).toEqual(true);
    expect(isInCall('Connecting')).toEqual(true);
    expect(isInCall('Ringing')).toEqual(true);
    expect(isInCall('Connected')).toEqual(true);
    expect(isInCall('Hold')).toEqual(true);
    expect(isInCall('InLobby')).toEqual(true);
    expect(isInCall('Disconnecting')).toEqual(true);
    expect(isInCall('EarlyMedia')).toEqual(true);
  });

  test('isGUID should return true if string is a GUID and false if not', () => {
    // false conditions
    expect(isGUID('')).toEqual(false);
    expect(isGUID('abc')).toEqual(false);
    expect(isGUID('989ccfd02a8611ebbdf67f55e6a39f29')).toEqual(false);
    expect(isGUID('989ccfd0.2a86.11eb.bdf6.7f55e6a39f29')).toEqual(false);

    // true conditions
    expect(isGUID('989ccfd0-2a86-11eb-bdf6-7f55e6a39f29')).toEqual(true);
  });
});
