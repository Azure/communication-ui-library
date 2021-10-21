// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import { _isInCall, _isPreviewOn } from './callUtils';

const deviceManagerMock: DeviceManagerState = {
  isSpeakerSelectionAvailable: false,
  cameras: [],
  microphones: [],
  speakers: [],
  unparentedViews: []
};

const invalidLocalVideoStreamMock: LocalVideoStreamState = {
  source: {
    name: 'test-stream',
    id: 'test-id',
    deviceType: 'Unknown'
  },
  mediaStreamType: 'Video',
  view: undefined
};

const validLocalVideoStreamMock: LocalVideoStreamState = {
  ...invalidLocalVideoStreamMock,
  view: {
    scalingMode: 'Stretch',
    isMirrored: false,
    target: null as any
  }
};

describe('callUtils tests', () => {
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

  test('_isPreviewOn should return true if detached views exist in the device manager', () => {
    // false when there are no unparented views
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [] })).toEqual(false);
    // false when there are no valid unparented views
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [invalidLocalVideoStreamMock] })).toEqual(false);

    // true when there is a valid unparented view
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [validLocalVideoStreamMock] })).toEqual(true);
  });
});
