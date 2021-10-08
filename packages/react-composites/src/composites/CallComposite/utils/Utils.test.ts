// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isInCall } from './Utils';

describe('SDKUtils tests', () => {
  describe('isInCall tests', () => {
    afterAll(() => {
      jest.resetAllMocks();
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
});
