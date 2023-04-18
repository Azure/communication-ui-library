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
import { act } from 'react-dom/test-utils';
import { initializeIcons } from '@fluentui/react';
import { CommunicationUserKind } from '@azure/communication-common';
import { render } from '@testing-library/react';

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

function renderWithParticipants(participants?: RemoteParticipantState[]): {
  container: HTMLElement;
  adapter: MockCallAdapter;
} {
  const adapter = new MockCallAdapter({});
  const { container } = render(<RootWrapper adapter={adapter} />);
  if (participants) {
    setParticipants(adapter, participants);
  }
  return { container, adapter };
}

function setParticipants(adapter: MockCallAdapter, participants: RemoteParticipantState[]): void {
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

function expectAnnounced(root: Element, value: string): void {
  const announcement = root.querySelector('#announcedString');
  expect(announcement?.innerHTML).toContain(`|${value}|`);
}

function expectNotAnnounced(root: Element, value: string): void {
  const announcement = root.querySelector('#announcedString');
  expect(announcement).toBeTruthy();
  expect(announcement?.innerHTML).not.toContain(`|${value}|`);
}

describe.only('useParticipantChangedAnnouncement', () => {
  beforeAll(() => {
    initializeIcons();
  });

  test('when 1 participant joined', () => {
    const { container, adapter } = renderWithParticipants();
    setParticipants(adapter, [participantWithName('donald')]);
    expectAnnounced(container, 'donald joined');
    expectNotAnnounced(container, 'donald left');
  });

  test('when 1 participant leaves', () => {
    const { container, adapter } = renderWithParticipants([participantWithName('donald')]);
    setParticipants(adapter, []);
    expectAnnounced(container, 'donald left');
  });

  // We don't currently handle the case when participants join and lave _at the exact same time_.
  // This is a very unlikely case as even a few milliseconds difference between participants
  // joinging / leaving will lead to two separate events rather than a single one.
  test.skip('when 1 participant joins and another leaves', () => {
    const { container, adapter } = renderWithParticipants([participantWithName('donald')]);
    setParticipants(adapter, [participantWithName('prathmesh')]);
    expectAnnounced(container, 'donald left');
    expectAnnounced(container, 'prathmesh joined');
    expectNotAnnounced(container, 'prathmesh left');
  });

  test('when 2 participants joined', () => {
    const donald = participantWithName('donald');
    const { container, adapter } = renderWithParticipants([donald]);
    setParticipants(adapter, [donald, participantWithName('prathmesh'), participantWithName('zeta')]);
    expectAnnounced(container, 'prathmesh and zeta have joined');
    expectNotAnnounced(container, 'donald left');
    expectNotAnnounced(container, 'prathmesh and zeta have left');
  });

  test('when 2 participants left', () => {
    const donald = participantWithName('donald');
    const { container, adapter } = renderWithParticipants([
      donald,
      participantWithName('prathmesh'),
      participantWithName('zeta')
    ]);
    setParticipants(adapter, [donald]);
    expectAnnounced(container, 'prathmesh and zeta have left');
    expectNotAnnounced(container, 'prathmesh and zeta have joined');
    expectNotAnnounced(container, 'donald left');
  });

  test('when 3 participants joined', () => {
    const { container, adapter } = renderWithParticipants([]);
    setParticipants(adapter, [
      participantWithName('donald'),
      participantWithName('prathmesh'),
      participantWithName('zeta')
    ]);
    expectAnnounced(container, 'donald, prathmesh and zeta have joined');
    expectNotAnnounced(container, 'donald, prathmesh and zeta have left');
  });

  test('when 3 participant left', () => {
    const donald = participantWithName('donald');
    const prathmesh = participantWithName('prathmesh');
    const { container, adapter } = renderWithParticipants([donald]);
    setParticipants(adapter, [donald, prathmesh]);
    setParticipants(adapter, [donald, prathmesh, participantWithName('zeta')]);
    setParticipants(adapter, []);
    expectAnnounced(container, 'donald, prathmesh and zeta have left');
    expectNotAnnounced(container, 'prathmesh left');
    expectNotAnnounced(container, 'donald left');
    expectNotAnnounced(container, 'zeta left');
    expectNotAnnounced(container, 'donald, prathmesh and zeta have joined');
  });

  test('when 4 participants joined', () => {
    const { container, adapter } = renderWithParticipants([]);
    setParticipants(adapter, [
      participantWithName('donald'),
      participantWithName('prathmesh'),
      participantWithName('zeta'),
      participantWithName('armadillo')
    ]);
    expectAnnounced(container, 'donald, prathmesh, zeta and 1 other participants joined');
  });

  test('when 4 participants left', () => {
    const straggler = participantWithName('straggler');
    const { container, adapter } = renderWithParticipants([
      participantWithName('donald'),
      straggler,
      participantWithName('prathmesh'),
      participantWithName('zeta'),
      participantWithName('armadillo')
    ]);
    setParticipants(adapter, [straggler]);
    expectAnnounced(container, 'donald, prathmesh, zeta and 1 other participants left');
  });

  test('when 1 unnamed participant joined', () => {
    const { container, adapter } = renderWithParticipants();
    setParticipants(adapter, [participantWithoutName('some-id')]);
    expectAnnounced(container, 'unnamed participant joined');
    expectNotAnnounced(container, 'unnamed participant left');
    expectNotAnnounced(container, 'some-id joined');
  });

  test('when 1 unnamed participant left', () => {
    const { container, adapter } = renderWithParticipants([participantWithoutName('some-id')]);
    setParticipants(adapter, []);
    expectAnnounced(container, 'unnamed participant left');
    expectNotAnnounced(container, 'some-id left');
  });

  test('when more than one unnamed participant joined', () => {
    const donald = participantWithName('donald');
    const { container, adapter } = renderWithParticipants([donald]);
    setParticipants(adapter, [
      donald,
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithoutName('some-id2'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    expectAnnounced(container, 'unnamed participant and 4 other participants joined');
    expectNotAnnounced(container, 'unnamed participant and 4 other participants left');
    expectNotAnnounced(container, 'some-id has joined');
  });

  test('when more than one unnamed participant left', () => {
    const donald = participantWithName('donald');
    const { container, adapter } = renderWithParticipants([
      donald,
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithoutName('some-id2'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    setParticipants(adapter, [donald]);
    expectAnnounced(container, 'unnamed participant and 4 other participants left');
    expectNotAnnounced(container, 'some-id has left');
  });

  test('when more than one participant joined with unnamed participants', () => {
    const { container, adapter } = renderWithParticipants([]);
    setParticipants(adapter, [
      participantWithName('donald'),
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithName('prathmesh'),
      participantWithoutName('some-id2'),
      participantWithName('armadillo'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    expectAnnounced(container, 'donald, prathmesh, armadillo and 5 other participants joined');
    expectNotAnnounced(container, 'some-id has joined');
  });

  test('when more than one participant left with unnamed participants', () => {
    const { container, adapter } = renderWithParticipants([
      participantWithName('donald'),
      participantWithoutName('some-id'),
      participantWithoutName('some-id1'),
      participantWithName('prathmesh'),
      participantWithoutName('some-id2'),
      participantWithName('armadillo'),
      participantWithoutName('some-id3'),
      participantWithoutName('some-id4')
    ]);
    setParticipants(adapter, []);
    expectAnnounced(container, 'donald, prathmesh, armadillo and 5 other participants left');
    expectNotAnnounced(container, 'some-id has left');
  });

  test('when 1 participant joined and then mutes their mic', () => {
    const donald = participantWithName('donald');
    // An entirely new `RemoteParticipant` object is returned when a field in the object changes.
    const mutedDonald = participantWithName('donald');
    mutedDonald.isMuted = true;
    const speakingDonald = participantWithName('donald');
    speakingDonald.isSpeaking = true;

    const { container, adapter } = renderWithParticipants();
    setParticipants(adapter, [donald]);
    setParticipants(adapter, [mutedDonald]);
    setParticipants(adapter, [speakingDonald]);
    expectAnnounced(container, 'donald joined');
    expectNotAnnounced(container, 'donald left');
  });
});
