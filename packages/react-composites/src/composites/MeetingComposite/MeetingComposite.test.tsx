// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { CallComposite } from '../CallComposite/CallComposite';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales';
import { CallAndChatAdapter } from './adapter/MeetingAdapter';
import { CallAndChatComposite } from './MeetingComposite';
import { CallAndChatAdapterState } from './state/MeetingAdapterState';

Enzyme.configure({ adapter: new Adapter() });

function createMockCallAndChatAdapter(): CallAndChatAdapter {
  const callAndChatAdapter = {} as CallAndChatAdapter;
  callAndChatAdapter.onStateChange = jest.fn();
  callAndChatAdapter.offStateChange = jest.fn();
  callAndChatAdapter.askDevicePermission = jest.fn();
  callAndChatAdapter.queryCameras = jest.fn();
  callAndChatAdapter.queryMicrophones = jest.fn();
  callAndChatAdapter.querySpeakers = jest.fn();
  callAndChatAdapter.on = jest.fn(); // allow for direct subscription to the state of the call-and-chat adapter
  callAndChatAdapter.off = jest.fn(); // Allow for direct un-subscription to the state of the call-and-chat adapter
  callAndChatAdapter.getState = jest.fn((): CallAndChatAdapterState => {
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
  return callAndChatAdapter;
}

describe('CallAndChatComposite', () => {
  test('Should pass down BaseCompositeProps to internal CallComposite', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      onFetchParticipantMenuItems: jest.fn()
    };

    const mockCallAndChatAdapter = createMockCallAndChatAdapter();

    const callAndChatComposite = Enzyme.mount(
      <CallAndChatComposite callAndChatAdapter={mockCallAndChatAdapter} {...mockBaseCompositeProps} />
    );

    const callComposites = callAndChatComposite.find(CallComposite);
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
