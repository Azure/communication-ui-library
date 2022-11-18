// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier, _formatString } from '@internal/acs-ui-common';
import { CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import React from 'react';
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
  const announcement = useParticipantChangedAnnouncement();
  return <div id="announcedString">{announcement}</div>;
}

function mountWithParticipants(participantNames?: string[]): { root: ReactWrapper; adapter: MockCallAdapter } {
  const adapter = new MockCallAdapter({});
  let root;
  act(() => {
    root = mount(<RootWrapper adapter={adapter} />);
  });
  if (participantNames) {
    setParticipants(root, adapter, participantNames);
  }
  return { root, adapter };
}

function setParticipants(root: ReactWrapper, adapter: MockCallAdapter, participantNames: string[]): void {
  const participants = Object.fromEntries(
    participantNames.map((name) => {
      const identifier: CommunicationUserKind = { communicationUserId: name, kind: 'communicationUser' };
      const participant: RemoteParticipantState = {
        displayName: name,
        identifier: identifier,
        state: 'Connected',
        videoStreams: {},
        isMuted: false,
        isSpeaking: false
      };
      return [toFlatCommunicationIdentifier(identifier), participant];
    })
  );
  const call: CallState | undefined = adapter.state.call
    ? { ...adapter.state.call, remoteParticipants: participants }
    : undefined;
  act(() => {
    adapter.setState({ ...adapter.state, call });
  });
}

function expectAnnouncement(root: ReactWrapper, value: string): void {
  const announcement = root.find('#announcedString');
  expect(announcement.html().toString()).toContain(value);
}

describe('useParticipantChangedAnnouncement', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('when 1 participant joined', () => {
    const { root, adapter } = mountWithParticipants();
    setParticipants(root, adapter, ['donald']);
    expectAnnouncement(root, 'donald joined');
  });

  test.only('when 1 participant leaves', () => {
    const { root, adapter } = mountWithParticipants(['donald']);
    setParticipants(root, adapter, []);
    expectAnnouncement(root, 'donald left');
  });
});
