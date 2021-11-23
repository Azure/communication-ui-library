// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { CallComposite } from '../CallComposite/CallComposite';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales';
import { MeetingAdapter } from './adapter/MeetingAdapter';
import { MeetingComposite } from './MeetingComposite';
import { MeetingAdapterState } from './state/MeetingAdapterState';

Enzyme.configure({ adapter: new Adapter() });

function createMockMeetingAdapter(): MeetingAdapter {
  const meetingAdapter = {} as MeetingAdapter;
  meetingAdapter.onStateChange = jest.fn();
  meetingAdapter.offStateChange = jest.fn();
  meetingAdapter.askDevicePermission = jest.fn();
  meetingAdapter.queryCameras = jest.fn();
  meetingAdapter.queryMicrophones = jest.fn();
  meetingAdapter.querySpeakers = jest.fn();
  meetingAdapter.getState = jest.fn((): MeetingAdapterState => {
    return {
      page: 'lobby',
      isLocalPreviewMicrophoneEnabled: false,
      userId: { kind: 'communicationUser', communicationUserId: 'test' },
      displayName: 'test',
      devices: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      isTeamsCall: true,
      meeting: undefined
    };
  });
  return meetingAdapter;
}

describe('MeetingComposite', () => {
  test('Should pass down BaseCompositeProps to internal CallComposite', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      onFetchParticipantMenuItems: jest.fn()
    };

    const mockMeetingAdapter = createMockMeetingAdapter();

    const meetingComposite = Enzyme.mount(
      <MeetingComposite meetingAdapter={mockMeetingAdapter} {...mockBaseCompositeProps} />
    );

    const callComposites = meetingComposite.find(CallComposite);
    expect(callComposites.length).toBe(1);

    const callComposite = callComposites.first();
    expect(callComposite.props().fluentTheme).toBe(mockBaseCompositeProps.fluentTheme);
    expect(callComposite.props().icons).toBe(mockBaseCompositeProps.icons);
    expect(callComposite.props().locale).toBe(mockBaseCompositeProps.locale);
    expect(callComposite.props().rtl).toBe(mockBaseCompositeProps.rtl);
    expect(callComposite.props().onFetchAvatarPersonaData).toBe(mockBaseCompositeProps.onFetchAvatarPersonaData);
    expect(callComposite.props().onFetchParticipantMenuItems).toBe(mockBaseCompositeProps.onFetchParticipantMenuItems);
  });
});
