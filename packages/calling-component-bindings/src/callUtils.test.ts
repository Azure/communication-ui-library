// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier } from '@azure/communication-common';
import { DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import { isACSCallParticipants, isTeamsCallParticipants, _isInCall, _isPreviewOn } from './utils/callUtils';

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

const nonTeamsParticipants: CommunicationIdentifier[] = [
  {
    phoneNumber: '0000000'
  },
  {
    communicationUserId: '0000000'
  }
];

const teamsParticipants: CommunicationIdentifier[] = [
  {
    phoneNumber: '0000000'
  },
  {
    microsoftTeamsUserId: '0000000'
  }
];

describe('callUtils tests', () => {
  test('isInCall should return true if state is Conneted or InLobby', () => {
    // false conditions
    expect(_isInCall('None')).toEqual(false);
    expect(_isInCall('Disconnected')).toEqual(false);
    expect(_isInCall('Connecting')).toEqual(false);
    expect(_isInCall('Ringing')).toEqual(false);
    expect(_isInCall('EarlyMedia')).toEqual(false);
    expect(_isInCall('Disconnecting')).toEqual(false);

    // true conditions
    expect(_isInCall('LocalHold')).toEqual(true);
    expect(_isInCall('Connected')).toEqual(true);
    expect(_isInCall('InLobby')).toEqual(true);
    expect(_isInCall('RemoteHold')).toEqual(true);
  });

  test('_isPreviewOn should return true if detached views exist in the device manager', () => {
    // false when there are no unparented views
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [] })).toEqual(false);
    // false when there are no valid unparented views
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [invalidLocalVideoStreamMock] })).toEqual(false);

    // true when there is a valid unparented view
    expect(_isPreviewOn({ ...deviceManagerMock, unparentedViews: [validLocalVideoStreamMock] })).toEqual(true);
  });

  test('isTeamsCallParticipants should return true if all participants are non teams participant', () => {
    expect(isTeamsCallParticipants(nonTeamsParticipants)).toEqual(false);
    expect(isTeamsCallParticipants(teamsParticipants)).toEqual(true);
  });

  test('isNonTeamsCallParticipants should return true if all participants are non teams participant', () => {
    expect(isACSCallParticipants(nonTeamsParticipants)).toEqual(true);
    expect(isACSCallParticipants(teamsParticipants)).toEqual(false);
  });
});
