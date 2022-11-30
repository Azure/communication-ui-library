// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier, _formatString } from '@internal/acs-ui-common';
import { CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import React, { useState } from 'react';
import { COMPOSITE_LOCALE_EN_US } from '../../localization/locales';
import { LocalizationProvider } from '../../localization/LocalizationProvider';
import { CallAdapterProvider } from '../adapter/CallAdapterProvider';
import { MockCallAdapter } from '../MockCallAdapter';
import { useParticipantChangedAnnouncement } from './MediaGalleryUtils';
import Enzyme, { ReactWrapper, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { initializeIcons } from '@fluentui/react';
import { CommunicationUserKind } from '@azure/communication-common';

function RootWrapper(props: { adapter: MockCallAdapter }): JSX.Element {
  const { adapter } = props;
  return (
    <>
      <CallAdapterProvider adapter={adapter}>
        <LocalizationProvider locale={COMPOSITE_LOCALE_EN_US}>
          <HookWrapper />
        </LocalizationProvider>
      </CallAdapterProvider>
    </>
  );
}

// participants is passed down just to trigger a rerender.
function HookWrapper(): JSX.Element {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcement = useParticipantChangedAnnouncement();
  // Don't do this in prod code. This can render loop forever.
  if (announcements.findIndex((a) => a === announcement) === -1) {
    setAnnouncements([...announcements, announcement]);
  }
  return <div id="announcedString">{JSON.stringify(announcements.map((v) => `|${v}|`))}</div>;
}

function mountWithParticipants(participants?: RemoteParticipantState[]): {
  root: ReactWrapper;
  adapter: MockCallAdapter;
} {
  const adapter = new MockCallAdapter({});
  let root;
  act(() => {
    root = mount(<RootWrapper adapter={adapter} />);
  });
  if (participants) {
    setParticipants(root, adapter, participants);
  }
  return { root, adapter };
}

function setParticipants(root: ReactWrapper, adapter: MockCallAdapter, participants: RemoteParticipantState[]): void {
  const call: CallState | undefined = adapter.state.call
    ? {
        ...adapter.state.call,
        remoteParticipants: Object.fromEntries(
          participants.map((p) => [toFlatCommunicationIdentifier(p.identifier), p])
        )
      }
    : undefined;
  act(() => {
    adapter.setState({ ...adapter.state, call });
  });
}

function participantWithName(name: string): RemoteParticipantState {
  const identifier: CommunicationUserKind = { communicationUserId: name, kind: 'communicationUser' };
  return {
    displayName: name,
    identifier: identifier,
    state: 'Connected',
    videoStreams: {},
    isMuted: false,
    isSpeaking: false
  };
}

function participantWithoutName(userId: string): RemoteParticipantState {
  const identifier: CommunicationUserKind = { communicationUserId: userId, kind: 'communicationUser' };
  return {
    identifier: identifier,
    state: 'Connected',
    videoStreams: {},
    isMuted: false,
    isSpeaking: false
  };
}

function expectAnnounced(root: ReactWrapper, value: string): void {
  const announcement = root.find('#announcedString');
  expect(announcement.html().toString()).toContain(`|${value}|`);
}

function expectNotAnnounced(root: ReactWrapper, value: string): void {
  const announcement = root.find('#announcedString');
  expect(announcement.html().toString()).not.toContain(`|${value}|`);
}

describe.only('useParticipantChangedAnnouncement', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('when 1 participant joined', () => {
    const { root, adapter } = mountWithParticipants();
    setParticipants(root, adapter, [participantWithName('donald')]);
    expectAnnounced(root, 'donald joined');
    expectNotAnnounced(root, 'donald left');
  });

  test('when 1 participant leaves', () => {
    const { root, adapter } = mountWithParticipants([participantWithName('donald')]);
    setParticipants(root, adapter, []);
    expectAnnounced(root, 'donald left');
  });

  // We don't currently handle the case when participants join and lave _at the exact same time_.
  // This is a very unlikely case as even a few milliseconds difference between participants
  // joinging / leaving will lead to two separate events rather than a single one.
  test.skip('when 1 participant joins and another leaves', () => {
    const { root, adapter } = mountWithParticipants([participantWithName('donald')]);
    setParticipants(root, adapter, [participantWithName('prathmesh')]);
    expectAnnounced(root, 'donald left');
    expectAnnounced(root, 'prathmesh joined');
    expectNotAnnounced(root, 'prathmesh left');
  });

  test('when 2 participants joined', () => {
    const donald = participantWithName('donald');
    const { root, adapter } = mountWithParticipants([donald]);
    setParticipants(root, adapter, [donald, participantWithName('prathmesh'), participantWithName('zeta')]);
    expectAnnounced(root, 'prathmesh and zeta have joined');
    expectNotAnnounced(root, 'donald left');
    expectNotAnnounced(root, 'prathmesh and zeta have left');
  });

  test('when 2 participants left', () => {
    const donald = participantWithName('donald');
    const { root, adapter } = mountWithParticipants([
      donald,
      participantWithName('prathmesh'),
      participantWithName('zeta')
    ]);
    setParticipants(root, adapter, [donald]);
    expectAnnounced(root, 'prathmesh and zeta have left');
    expectNotAnnounced(root, 'prathmesh and zeta have joined');
    expectNotAnnounced(root, 'donald left');
  });

  test('when 3 participants joined', () => {
    const { root, adapter } = mountWithParticipants([]);
    setParticipants(root, adapter, [
      participantWithName('donald'),
      participantWithName('prathmesh'),
      participantWithName('zeta')
    ]);
    expectAnnounced(root, 'donald, prathmesh and zeta have joined');
    expectNotAnnounced(root, 'donald, prathmesh and zeta have left');
  });

  test('when 3 participant left', () => {
    const donald = participantWithName('donald');
    const prathmesh = participantWithName('prathmesh');
    const { root, adapter } = mountWithParticipants([donald]);
    setParticipants(root, adapter, [donald, prathmesh]);
    setParticipants(root, adapter, [donald, prathmesh, participantWithName('zeta')]);
    setParticipants(root, adapter, []);
    expectAnnounced(root, 'donald, prathmesh and zeta have left');
    expectNotAnnounced(root, 'prathmesh left');
    expectNotAnnounced(root, 'donald left');
    expectNotAnnounced(root, 'zeta left');
    expectNotAnnounced(root, 'donald, prathmesh and zeta have joined');
  });

  test('when 4 participants joined', () => {
    const { root, adapter } = mountWithParticipants([]);
    setParticipants(root, adapter, [
      participantWithName('donald'),
      participantWithName('prathmesh'),
      participantWithName('zeta'),
      participantWithName('armadillo')
    ]);
    expectAnnounced(root, 'donald, prathmesh, zeta and 1 other participants joined');
  });

  test('when 4 participants left', () => {
    const straggler = participantWithName('straggler');
    const { root, adapter } = mountWithParticipants([
      participantWithName('donald'),
      straggler,
      participantWithName('prathmesh'),
      participantWithName('zeta'),
      participantWithName('armadillo')
    ]);
    setParticipants(root, adapter, [straggler]);
    expectAnnounced(root, 'donald, prathmesh, zeta and 1 other participants left');
  });

  test('when 1 unnamed participant joined', () => {
    const { root, adapter } = mountWithParticipants();
    setParticipants(root, adapter, [participantWithoutName('some-id')]);
    expectAnnounced(root, 'unnamed participant joined');
    expectNotAnnounced(root, 'unnamed participant left');
    expectNotAnnounced(root, 'some-id joined');
  });

  test('when 1 unnamed participant left', () => {
    const { root, adapter } = mountWithParticipants([participantWithoutName('some-id')]);
    setParticipants(root, adapter, []);
    expectAnnounced(root, 'unnamed participant left');
    expectNotAnnounced(root, 'some-id left');
  });

  test('when more than one unnamed participant joined', () => {
    const donald = participantWithName('donald');
    const { root, adapter } = mountWithParticipants([donald]);
    setParticipants(root, adapter, [
      donald,
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithoutName('some-id2'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    expectAnnounced(root, 'unnamed participant and 4 other participants joined');
    expectNotAnnounced(root, 'unnamed participant and 4 other participants left');
    expectNotAnnounced(root, 'some-id has joined');
  });

  test('when more than one unnamed participant left', () => {
    const donald = participantWithName('donald');
    const { root, adapter } = mountWithParticipants([
      donald,
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithoutName('some-id2'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    setParticipants(root, adapter, [donald]);
    expectAnnounced(root, 'unnamed participant and 4 other participants left');
    expectNotAnnounced(root, 'some-id has left');
  });

  test('when more than one participant joined with unnamed participants', () => {
    const { root, adapter } = mountWithParticipants([]);
    setParticipants(root, adapter, [
      participantWithName('donald'),
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithName('prathmesh'),
      participantWithoutName('some-id2'),
      participantWithName('armadillo'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    expectAnnounced(root, 'donald, prathmesh, armadillo and 5 other participants joined');
    expectNotAnnounced(root, 'some-id has joined');
  });

  test('when more than one participant left with unnamed participants', () => {
    const { root, adapter } = mountWithParticipants([
      participantWithName('donald'),
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithName('prathmesh'),
      participantWithoutName('some-id2'),
      participantWithName('armadillo'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    setParticipants(root, adapter, []);
    expectAnnounced(root, 'donald, prathmesh, armadillo and 5 other participants left');
    expectNotAnnounced(root, 'some-id has left');
  });

  test('when 1 participant joined and then mutes their mic', () => {
    const donald = participantWithName('donald');
    // An entirely new `RemoteParticipant` object is returned when a field in the object changes.
    const mutedDonald = participantWithName('donald');
    mutedDonald.isMuted = true;
    const speakingDonald = participantWithName('donald');
    speakingDonald.isSpeaking = true;

    const { root, adapter } = mountWithParticipants();
    setParticipants(root, adapter, [donald]);
    setParticipants(root, adapter, [mutedDonald]);
    setParticipants(root, adapter, [speakingDonald]);
    expectAnnounced(root, 'donald joined');
    expectNotAnnounced(root, 'donald left');
  });
});
