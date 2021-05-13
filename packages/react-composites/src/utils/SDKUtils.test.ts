// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo } from '@azure/communication-calling';
import { CommunicationUserKind, PhoneNumberKind, UnknownIdentifierKind } from '@azure/communication-common';
import { getACSId, isInCall, isSelectedDeviceInList } from './SDKUtils';

describe('SDKUtils tests', () => {
  describe('getACSId tests', () => {
    afterAll(() => {
      jest.resetAllMocks();
    });

    test('getACSId should return CommunicationUserId if the identifier is a CommunicationUser', () => {
      // Arrange
      const expectedId = 'testUserId';
      const identifer: CommunicationUserKind = { communicationUserId: expectedId, kind: 'communicationUser' };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });

    test('getACSId should return PhoneNumber if the identifier is a PhoneNumber', () => {
      // Arrange
      const expectedId = 'testPhoneNumber';
      const identifer: PhoneNumberKind = { phoneNumber: expectedId, kind: 'phoneNumber' };

      // Act
      const id = getACSId(identifer);

      // Assert
      expect(id).toEqual(expectedId);
    });

    test('getACSId should return id if the identifier is unknown', () => {
      // Arrange
      const expectedId = 'testId';
      const identifer: UnknownIdentifierKind = { id: expectedId, kind: 'unknown' };

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
    expect(isInCall('Connecting')).toEqual(true);
    expect(isInCall('Ringing')).toEqual(true);
    expect(isInCall('Connected')).toEqual(true);
    expect(isInCall('LocalHold')).toEqual(true);
    expect(isInCall('RemoteHold')).toEqual(true);
    expect(isInCall('InLobby')).toEqual(true);
    expect(isInCall('Disconnecting')).toEqual(true);
    expect(isInCall('EarlyMedia')).toEqual(true);
  });
});
