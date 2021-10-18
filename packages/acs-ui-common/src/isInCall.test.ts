// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall } from './isInCall';

describe('isInCall tests', () => {
  test('isInCall should return true if state is anything other than none or disconnected', () => {
    // false conditions
    expect(_isInCall('None')).toEqual(false);
    expect(_isInCall('Disconnected')).toEqual(false);
    expect(_isInCall('Connecting')).toEqual(false);

    // true conditions
    expect(_isInCall('Ringing')).toEqual(true);
    expect(_isInCall('Connected')).toEqual(true);
    expect(_isInCall('LocalHold')).toEqual(true);
    expect(_isInCall('RemoteHold')).toEqual(true);
    expect(_isInCall('InLobby')).toEqual(true);
    expect(_isInCall('Disconnecting')).toEqual(true);
    expect(_isInCall('EarlyMedia')).toEqual(true);
  });
});
