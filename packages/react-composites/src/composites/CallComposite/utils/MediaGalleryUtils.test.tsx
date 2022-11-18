// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { createAnnouncmentString } from './MediaGalleryUtils';

const mockParticipant: RemoteParticipantState = {
  displayName: 'test',
  identifier: { communicationUserId: 'test', kind: 'communicationUser' },
  state: 'Connected',
  videoStreams: {},
  isMuted: false,
  isSpeaking: false
};

const mockNoNameParticipant: RemoteParticipantState = {
  displayName: undefined,
  identifier: { communicationUserId: 'test', kind: 'communicationUser' },
  state: 'Connected',
  videoStreams: {},
  isMuted: false,
  isSpeaking: false
};

const strings = {
  participantJoinedNoticeString: '{displayName} joined',
  twoParticipantJoinedNoticeString: '{displayName1} and {displayName2} have joined',
  threeParticipantJoinedNoticeString: '{displayName1}, {displayName2} and {displayName3} have joined',
  participantLeftNoticeString: '{displayName} left',
  twoParticipantLeftNoticeString: '{displayName1} and {displayName2} have left',
  threeParticipantLeftNoticeString: '{displayName1}, {displayName2} and {displayName3} have left',
  unnamedParticipantString: 'unnamed participant',
  manyUnnamedParticipantsJoined: 'unnamed participant and {numOfParticipants} other participants joined',
  manyUnnamedParticipantsLeft: 'unnamed participant and {numOfParticipants} other participants left',
  manyParticipantsJoined:
    '{displayName1}, {displayName2}, {displayName3} and {numOfParticipants} other participants joined',
  manyParticipantsLeft: '{displayName1}, {displayName2}, {displayName3} and {numOfParticipants} other participants left'
};

describe('Participant Changed announcement string tests', () => {
  test('Strings when participants join should be correct', () => {
    let participants: RemoteParticipantState[] = [];

    // test one participant joined with names
    participants.push(mockParticipant);

    expect(createAnnouncmentString('joined', participants, strings)).toEqual(
      _formatString(strings.participantJoinedNoticeString, { displayName: 'test' })
    );

    participants = [];

    // test two participants joined with names
    for (let i = 0; i < 2; i++) {
      participants.push(mockParticipant);
    }

    expect(createAnnouncmentString('joined', participants, strings)).toEqual(
      _formatString(strings.twoParticipantJoinedNoticeString, { displayName1: 'test', displayName2: 'test' })
    );

    participants = [];

    // test 3 participants with names
    for (let i = 0; i < 3; i++) {
      participants.push(mockParticipant);
    }

    expect(createAnnouncmentString('joined', participants, strings)).toEqual(
      _formatString(strings.threeParticipantJoinedNoticeString, {
        displayName1: 'test',
        displayName2: 'test',
        displayName3: 'test'
      })
    );
  });

  test('Strings when participants left should be correct', () => {
    let participants: RemoteParticipantState[] = [];

    // test one participant joined with names
    participants.push(mockParticipant);

    expect(createAnnouncmentString('left', participants, strings)).toEqual(
      _formatString(strings.participantLeftNoticeString, { displayName: 'test' })
    );

    participants = [];

    // test two participants joined with names
    for (let i = 0; i < 2; i++) {
      participants.push(mockParticipant);
    }

    expect(createAnnouncmentString('left', participants, strings)).toEqual(
      _formatString(strings.twoParticipantLeftNoticeString, { displayName1: 'test', displayName2: 'test' })
    );

    participants = [];

    // test 3 participants with names
    for (let i = 0; i < 3; i++) {
      participants.push(mockParticipant);
    }

    expect(createAnnouncmentString('left', participants, strings)).toEqual(
      _formatString(strings.threeParticipantLeftNoticeString, {
        displayName1: 'test',
        displayName2: 'test',
        displayName3: 'test'
      })
    );
  });
  test('Strings when multiple unnamed participants join and leave should be correct', () => {
    const participants: RemoteParticipantState[] = [];

    for (let i = 0; i < 5; i++) {
      participants.push(mockNoNameParticipant);
    }

    expect(createAnnouncmentString('joined', participants, strings)).toEqual(
      _formatString(strings.manyUnnamedParticipantsJoined, { numOfParticipants: '4' })
    );

    expect(createAnnouncmentString('left', participants, strings)).toEqual(
      _formatString(strings.manyUnnamedParticipantsLeft, { numOfParticipants: '4' })
    );
  });
  test('Strings when multiple named participants join and leave should be correct', () => {
    const participants: RemoteParticipantState[] = [];
    for (let i = 0; i < 5; i++) {
      participants.push(mockParticipant);
    }

    expect(createAnnouncmentString('joined', participants, strings)).toEqual(
      _formatString(strings.manyParticipantsJoined, {
        displayName1: 'test',
        displayName2: 'test',
        displayName3: 'test',
        numOfParticipants: '2'
      })
    );

    expect(createAnnouncmentString('left', participants, strings)).toEqual(
      _formatString(strings.manyParticipantsLeft, {
        displayName1: 'test',
        displayName2: 'test',
        displayName3: 'test',
        numOfParticipants: '2'
      })
    );
  });
});
