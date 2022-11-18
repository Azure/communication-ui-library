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

const locale = {
  ...COMPOSITE_LOCALE_EN_US,
  strings: {
    ...COMPOSITE_LOCALE_EN_US.strings,
    call: {
      ...COMPOSITE_LOCALE_EN_US.strings.call,
      ...strings
    }
  }
};

function RootWrapper(props: { adapter: MockCallAdapter }): JSX.Element {
  const { adapter } = props;
  return (
    <>
      <CallAdapterProvider adapter={adapter}>
        <LocalizationProvider locale={locale}>
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

  // Edge case.
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
});
