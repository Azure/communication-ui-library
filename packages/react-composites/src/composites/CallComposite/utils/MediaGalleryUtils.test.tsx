// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatString } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import React, { useEffect } from 'react';
import { COMPOSITE_LOCALE_EN_US } from '../../localization/locales';
import { LocalizationProvider } from '../../localization/LocalizationProvider';
import { CallAdapterState } from '../adapter/CallAdapter';
import { CallAdapterProvider } from '../adapter/CallAdapterProvider';
import { MockCallAdapter } from '../MockCallAdapter';
import { useParticipantChangedAnnouncement } from './MediaGalleryUtils';
import Enzyme, { ReactWrapper, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { initializeIcons } from '@fluentui/react';

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

function RootWrapper(props: { adapter: MockCallAdapter; participants: RemoteParticipantState[] }): JSX.Element {
  const { adapter, participants } = props;
  useEffect(() => {
    adapter.state = {
      call: {
        remoteParticipants: participants
      }
    } as unknown as CallAdapterState;
  }, [participants]);
  return (
    <>
      <CallAdapterProvider adapter={adapter}>
        <LocalizationProvider locale={locale}>
          <HookWrapper participants={participants} />
        </LocalizationProvider>
      </CallAdapterProvider>
    </>
  );
}

// participants is passed down just to trigger a rerender.
function HookWrapper(props: { participants: RemoteParticipantState[] }): JSX.Element {
  const announcement = useParticipantChangedAnnouncement();
  return <div id="announcedString">muahahaha {announcement}</div>;
}

function mountWithNoParticipants(): { root: ReactWrapper; adapter: MockCallAdapter } {
  const adapter = new MockCallAdapter({});
  let root;
  act(() => {
    root = mount(<RootWrapper adapter={adapter} participants={[]} />);
  });
  return { root, adapter };
}

function setParticipants(root: ReactWrapper, adapter: MockCallAdapter, participantNames: string[]): void {
  const participants = participantNames.map((name) => ({
    displayName: name,
    identifier: { communicationUserId: name, kind: 'communicationUser' },
    state: 'Connected',
    videoStreams: {},
    isMuted: false,
    isSpeaking: false
  }));
  act(() => {
    root.setProps({ adapter, participants });
  });
}

function expectAnnouncement(root: ReactWrapper, value: string): void {
  const announcement = root.find('#announcedString');
  expect(announcement.html().toString()).toContain(value);
}

describe.only('useParticipantChangedAnnouncement', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('gets invoked', () => {
    const { root, adapter } = mountWithNoParticipants();
    setParticipants(root, adapter, ['donald']);
    expectAnnouncement(root, 'muahahaha');
  });
});
